# Women Apply AI - Personalized Learning Journey 🚀

A beautiful, interactive web application that creates personalized AI learning journeys specifically designed for women. Built with vanilla HTML, CSS, and JavaScript, powered by Venice AI.

## ✨ Features

- **Personalized Assessment**: 12 carefully crafted questions designed specifically for women learning AI
- **Custom Learning Journey**: 10-chapter course tailored to your goals, experience, and industry
- **Interactive Prompting Examples**: Copy-to-clipboard prompts you can use immediately
- **Agent Prompt Workflows**: Step-by-step AI agent instructions with expected behaviors
- **AI Mindset Integration**: Encourages experimentation, critical thinking, and ethical awareness
- **Latest AI Insights**: Web-searched updates for each chapter topic
- **Export Functionality**: Download your personalized course as a standalone HTML file
- **Beautiful UI**: Professionally designed with Montserrat font and gradient animations

## 🎯 What Makes This Different

This isn't just another AI course generator. It's specifically designed with women in mind:
- Questions address unique challenges women face in tech
- Content builds confidence while teaching practical skills
- Emphasis on real-world applications and immediate value
- Supportive, encouraging tone throughout
- Focus on empowerment, not intimidation

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (with CSS Variables), Vanilla JavaScript
- **AI Backend**: Venice AI API
  - `qwen3-235b-a22b-thinking-2507` for chapter flow generation
  - `openai-gpt-oss-120b` for chapter content creation
  - `google-gemma-3-27b-it` for search and summarization
- **Font**: Montserrat (Google Fonts)
- **Storage**: LocalStorage for course data persistence

## 📦 Installation & Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Venice AI API key ([Get one here](https://venice.ai))
- A local web server (optional but recommended)

### Quick Start

1. **Clone or Download** this repository

2. **Add Your Venice API Key**
   - Open `api.js`
   - Replace the API key on line 8:
   ```javascript
   const VENICE_API_KEY = 'your_venice_api_key_here';
   ```

3. **Run a Local Server** (recommended)

   Using Python:
   ```bash
   python -m http.server 8000
   ```

   Using Node.js:
   ```bash
   npx http-server
   ```

   Using VS Code Live Server extension:
   - Install "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

4. **Open in Browser**
   - Navigate to `http://localhost:8000` (or your server's URL)
   - Click "Start Your Journey"
   - Complete the assessment
   - Wait for your personalized course to generate
   - Explore your learning journey!

## 📁 File Structure

```
WomenApplyAI/
├── index.html              # Main landing and assessment page
├── course-viewer.html      # Interactive course display
├── styles.css              # Main styles with variables
├── course-viewer.css       # Course-specific styles
├── app.js                  # Quiz logic and navigation
├── api.js                  # Venice AI integration
├── questions.js            # Assessment questions
├── course-viewer.js        # Course rendering and interactions
└── README.md              # This file
```

## 🎨 Design Features

- **Color Palette**: Purple (#8B5CF6) and Pink (#EC4899) gradients
- **Typography**: Montserrat font family at multiple weights
- **Responsive**: Mobile-first design that works on all devices
- **Animations**: Smooth transitions and floating elements
- **Accessibility**: Proper contrast ratios and semantic HTML

## 🚀 How It Works

### 1. Assessment Phase
Users answer 12 questions covering:
- Primary goals
- Current AI experience
- Industry and role
- Specific challenges
- Learning preferences
- Time commitment
- Technical background
- Barriers and concerns
- Immediate applications
- AI mindset
- Support needs

### 2. Generation Phase
The Venice AI API processes the user profile:
1. **Outline Generation** (0-20%): Creates 10-chapter structure
2. **Content Generation** (20-80%): Generates detailed content for each chapter
3. **Enrichment** (80-95%): Adds latest AI insights via web search
4. **Finalization** (95-100%): Assembles complete course

### 3. Learning Phase
Users explore their personalized journey:
- Navigate between chapters
- Copy and try prompting examples
- Learn agent workflows
- Complete hands-on exercises
- Reflect on AI mindset questions
- Export course for offline use

## 📚 Chapter Content Structure

Each chapter includes:
- **Introduction**: Why it matters and what you'll learn
- **Core Concepts**: 3-5 key ideas with examples
- **Prompting Examples**: 3-4 copy-ready prompts with explanations
- **Agent Prompt Examples**: 2-3 complex agent workflows
- **Try It Yourself**: 3-4 hands-on exercises
- **Key Takeaways**: 4-6 essential points
- **AI Mindset Reflection**: Question + confidence tip + ethical consideration
- **Latest Updates**: Recent insights from web search

## 🔧 Customization

### Change Models
Edit `api.js` to use different Venice models:
```javascript
const MODELS = {
    CHAPTER_FLOW: 'your-model-id',
    CHAPTER_CONTENT: 'your-model-id',
    SEARCH_SUMMARIZE: 'your-model-id'
};
```

### Modify Questions
Edit `questions.js` to customize the assessment:
- Add/remove questions
- Change options
- Adjust question types (single, multiple, textarea)

### Update Styling
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #8B5CF6;
    --secondary: #EC4899;
    /* ... more variables ... */
}
```

## 📊 API Usage & Costs

Typical course generation uses approximately:
- **Outline**: ~3,000 tokens
- **Per Chapter**: ~5,000-8,000 tokens
- **Latest Info**: ~2,000 tokens per chapter
- **Total**: ~70,000-100,000 tokens per complete course

Estimated cost (with Venice pricing): $0.50-$1.00 per course

## 🔒 Privacy & Data

- No server-side storage
- All course data stored in browser localStorage
- No user tracking or analytics
- API calls go directly to Venice AI
- Export your data anytime

## 🐛 Troubleshooting

### Course won't generate
- Check Venice API key is correct
- Verify internet connection
- Check browser console for errors
- Ensure models are available in Venice API

### Export not working
- Try a different browser
- Check popup blocker settings
- Ensure browser supports download attribute

### Styles not loading
- Verify Google Fonts connection
- Check CSS file paths
- Clear browser cache

## 🤝 Contributing

This is a standalone application, but improvements are welcome:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

© 2025 Women Apply AI. All rights reserved.

This project is for educational and personal use. Do not redistribute without permission.

## 🙏 Acknowledgments

- **Venice AI** for providing powerful, privacy-first AI models
- **Google Fonts** for the beautiful Montserrat typeface
- **The women in AI** who inspired this project

## 📞 Support

For issues or questions:
- Check this README first
- Review the code comments
- Check Venice AI documentation
- File an issue in the repository

---

**Built with ❤️ to empower women through AI education**

*Your journey to AI mastery starts here!*
