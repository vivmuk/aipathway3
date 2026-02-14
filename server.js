const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Get API key from environment variable (required)
// Strip wrapping quotes in case the env var was set as VENICE_API_KEY="..."
const VENICE_API_KEY = (process.env.VENICE_API_KEY || '').replace(/^["']|["']$/g, '');

if (!VENICE_API_KEY) {
    console.error('WARNING: VENICE_API_KEY environment variable is not set. API calls will fail.');
}

// Parse JSON request bodies
app.use(express.json({ limit: '1mb' }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for course viewer
app.get('/course-viewer.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'course-viewer.html'));
});

// Server-side proxy for Venice API calls
// Keeps the API key secure on the server — never sent to the browser
app.post('/api/venice/chat/completions', async (req, res) => {
    if (!VENICE_API_KEY) {
        return res.status(500).json({ error: { message: 'Server API key not configured' } });
    }

    try {
        const response = await fetch('https://api.venice.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${VENICE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (err) {
        console.error('Venice API proxy error:', err.message);
        res.status(502).json({ error: { message: `Proxy error: ${err.message}` } });
    }
});

// Test endpoint to verify Venice API key server-side
app.get('/api/test-key', async (req, res) => {
    if (!VENICE_API_KEY) {
        return res.json({ ok: false, error: 'VENICE_API_KEY environment variable is not set' });
    }

    try {
        const response = await fetch('https://api.venice.ai/api/v1/models', {
            headers: { 'Authorization': `Bearer ${VENICE_API_KEY}` }
        });

        if (response.ok) {
            const data = await response.json();
            const modelCount = data.data ? data.data.length : 0;
            res.json({ ok: true, status: response.status, modelCount, keyPreview: `${VENICE_API_KEY.substring(0, 6)}...${VENICE_API_KEY.substring(VENICE_API_KEY.length - 4)}` });
        } else {
            let errorBody = '';
            try { errorBody = await response.text(); } catch (_) {}
            res.json({ ok: false, status: response.status, statusText: response.statusText, errorBody });
        }
    } catch (err) {
        res.json({ ok: false, error: err.message });
    }
});

// Quiet favicon 404s
app.get('/favicon.ico', (_req, res) => {
    res.status(204).end();
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
    console.log(`Venice API key: ${VENICE_API_KEY.substring(0, 6)}...${VENICE_API_KEY.substring(VENICE_API_KEY.length - 4)} (${VENICE_API_KEY.length} chars)`);
});
