# Quick Setup Guide for Women Apply AI

## Step 1: Get Your Venice AI API Key

1. Go to [Venice.ai](https://venice.ai)
2. Sign up or log in
3. Navigate to API settings
4. Generate a new API key
5. Copy your API key

## Step 2: Configure the Application

1. Open `api.js` in a text editor
2. Find line 8 where it says:
   ```javascript
   const VENICE_API_KEY = 'lnWNeSg0pA_rQUooNpbfpPDBaj2vJnWol5WqKWrIEF';
   ```
3. Replace with your API key:
   ```javascript
   const VENICE_API_KEY = 'your_actual_api_key_here';
   ```
4. Save the file

## Step 3: Choose How to Run

### Option A: Simple File Opening (Not Recommended)
- Double-click `index.html`
- May have CORS issues
- LocalStorage might not work properly

### Option B: Python Server (Recommended)
```bash
# Navigate to the project folder
cd path/to/WomenApplyAI

# Start server
python -m http.server 8000

# Open browser to:
http://localhost:8000
```

### Option C: Node.js Server
```bash
# Install http-server globally (one time)
npm install -g http-server

# Navigate to project folder
cd path/to/WomenApplyAI

# Start server
http-server

# Open browser to displayed URL
```

### Option D: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Browser opens automatically

## Step 4: Test the Application

1. Click "Start Your Journey"
2. Answer a few questions
3. Click "Generate My Learning Journey"
4. Watch the progress bar
5. Explore your personalized course!

## Troubleshooting

### Error: "Venice API error"
- Check your API key is correct
- Verify you have API credits
- Check internet connection

### Error: "No course found"
- Make sure you completed the assessment
- Check browser localStorage is enabled
- Try a different browser

### Page looks broken
- Verify all CSS files are present
- Check browser console for errors
- Try clearing browser cache

### Can't export course
- Check browser allows downloads
- Disable popup blocker
- Try a different browser

## Next Steps

1. **Complete Assessment**: Answer all 12 questions honestly
2. **Generate Course**: Wait 2-5 minutes for generation
3. **Explore Content**: Navigate through your personalized chapters
4. **Try Prompts**: Copy examples and try them in ChatGPT, Claude, etc.
5. **Export**: Download your course for offline access

## Need Help?

- Read the full [README.md](README.md)
- Check the code comments
- Review Venice AI documentation
- File an issue on GitHub

---

**Ready to start your AI journey? Let's go! 🚀**
