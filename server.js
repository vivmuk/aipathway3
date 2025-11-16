const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Get API key from environment variable or use default
const VENICE_API_KEY = process.env.VENICE_API_KEY || 'lnWNeSg0pA_rQUooNpbfpPDBaj2vJnWol5WqKWrIEF';

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

// Quiet favicon 404s
app.get('/favicon.ico', (_req, res) => {
    res.status(204).end();
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});

