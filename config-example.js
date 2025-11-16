// ====================================
// CONFIGURATION EXAMPLE
// Copy this file to config.js and add your actual API key
// ====================================

// IMPORTANT: Never commit config.js to version control!
// Add config.js to your .gitignore file

const CONFIG = {
    // Your Venice AI API Key
    // Get one from https://venice.ai
    VENICE_API_KEY: 'your_venice_api_key_here',

    // Venice API Base URL (usually don't need to change)
    VENICE_BASE_URL: 'https://api.venice.ai/api/v1',

    // Models to use (you can customize these)
    MODELS: {
        // Model for generating chapter flow and structure
        CHAPTER_FLOW: 'qwen3-235b-a22b-thinking-2507',

        // Model for generating detailed chapter content
        CHAPTER_CONTENT: 'openai-gpt-oss-120b',

        // Model for search and summarization
        SEARCH_SUMMARIZE: 'google-gemma-3-27b-it'
    },

    // Course generation settings
    SETTINGS: {
        // Number of chapters to generate (10 is recommended)
        NUM_CHAPTERS: 10,

        // Enable latest updates via web search
        ENABLE_WEB_SEARCH: true,

        // Temperature for AI generation (0.0-1.0)
        // Higher = more creative, Lower = more focused
        TEMPERATURE: 0.7,

        // Maximum tokens per chapter
        MAX_TOKENS_PER_CHAPTER: 8000
    },

    // UI Settings
    UI: {
        // Primary brand color
        PRIMARY_COLOR: '#8B5CF6',

        // Secondary brand color
        SECONDARY_COLOR: '#EC4899',

        // Enable animations
        ENABLE_ANIMATIONS: true,

        // Show loading messages
        VERBOSE_LOADING: true
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
