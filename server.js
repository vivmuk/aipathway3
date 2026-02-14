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

// Serve static files from the current directory
app.use(express.static(__dirname));

// Helper function to inject API key into HTML
function injectApiKey(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Inject config script before closing head tag or before scripts
    const configScript = `
    <script>
        // Injected API configuration from environment variables
        window.VENICE_API_KEY = '${VENICE_API_KEY}';
    </script>`;
    
    // Insert before the first script tag or before closing </head>
    if (html.includes('</head>')) {
        html = html.replace('</head>', configScript + '</head>');
    } else if (html.includes('<script')) {
        html = html.replace('<script', configScript + '<script');
    }
    
    return html;
}

// Route for root
app.get('/', (req, res) => {
    const html = injectApiKey(path.join(__dirname, 'index.html'));
    res.send(html);
});

// Route for course viewer
app.get('/course-viewer.html', (req, res) => {
    const html = injectApiKey(path.join(__dirname, 'course-viewer.html'));
    res.send(html);
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

