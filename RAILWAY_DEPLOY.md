# Railway Deployment Guide

## Environment Variables

To deploy this application on Railway, you need to set the following environment variable:

### Required Environment Variable

**VENICE_API_KEY**
- **Description**: Your Venice AI API key
- **How to get it**: Get your API key from https://venice.ai
- **Current value** (fallback): `lnWNeSg0pA_rQUooNpbfpPDBaj2vJnWol5WqKWrIEF`

### How to Set Environment Variables in Railway

#### Option 1: Using Railway Dashboard
1. Go to your Railway project dashboard
2. Select your service
3. Click on the **Variables** tab
4. Click **New Variable**
5. Enter:
   - **Variable**: `VENICE_API_KEY`
   - **Value**: Your actual Venice API key
6. Click **Add**
7. Railway will automatically redeploy your application

#### Option 2: Using Railway CLI
```bash
railway variables set VENICE_API_KEY=your_api_key_here
```

#### Option 3: Using Railway Dashboard Settings
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add `VENICE_API_KEY` with your value
4. Save changes

### After Setting Environment Variables

Railway will automatically:
- Redeploy your application
- Inject the API key into your application at runtime
- Make it available to your application

### Verifying Environment Variables

After deployment, you can verify the environment variable is set:
1. Go to Railway dashboard
2. Select your service
3. Check the **Variables** tab
4. Ensure `VENICE_API_KEY` is listed

### Security Notes

- ✅ The API key is injected server-side into your HTML files
- ✅ Never commit your actual API key to GitHub
- ✅ Use Railway's environment variables for production
- ✅ The fallback key in the code is for local development only

### Local Development

For local development, you can either:
1. Use the fallback key hardcoded in `api.js`
2. Create a `.env` file (if you want to use dotenv - requires additional setup)
3. Set environment variables in your terminal:
   ```bash
   # Windows PowerShell
   $env:VENICE_API_KEY="your_key_here"
   python -m http.server 8000
   
   # Or use the Node.js server
   node server.js
   ```

## Deployment Steps

1. **Connect GitHub Repository**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `vivmuk/aipathway3`

2. **Set Environment Variable**
   - Add `VENICE_API_KEY` as described above

3. **Deploy**
   - Railway will automatically detect the `package.json` and `Procfile`
   - It will install dependencies and start the server
   - Your app will be live!

4. **Access Your App**
   - Railway provides a URL like `https://your-app.up.railway.app`
   - Visit the URL to use your application

## Troubleshooting

### API Key Not Working
- Verify the environment variable is set correctly in Railway
- Check that the variable name is exactly `VENICE_API_KEY` (case-sensitive)
- Redeploy the application after setting the variable

### API Calls Failing
- Check Railway logs for errors
- Verify your API key is valid at venice.ai
- Ensure the API key has sufficient credits

