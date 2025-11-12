# Lead Tracker Dashboard - Setup Instructions

## Project Overview

Your Lead Tracker Dashboard has been successfully created! The project is located at:
`C:\Users\Gregorius Erico\lead-tracker-dashboard`

## What's Been Built

### Features Implemented

1. **Left Sidebar Panel**
   - List of all leads from your Supabase database
   - Each lead shows:
     - Username (capitalized)
     - Last message date (YYYY-MM-DD format)
     - Time since last message (e.g., "5 days ago")
     - Last sender name
     - Action item status badge (color-coded)
   - Search bar for filtering by username
   - Status filter dropdown (All / Follow up / See if follow up needed)
   - Sort dropdown (A-Z, Z-A, Most Recent, Least Recent)

2. **Right Chat Panel**
   - Full conversation history
   - Messages parsed from "Sender: Message" format
   - Chat-style display:
     - Heidie Signature messages: Blue bubbles on the right
     - Other messages: Gray bubbles on the left
   - Oldest messages first (scroll down to see newer)
   - Header showing lead details and status

3. **AI Response Suggestions**
   - "Suggest a draft response" button at bottom of chat
   - Generates 2 response options using OpenAI GPT-4o-mini
   - Displays suggestions below the button
   - Loading state while processing

### Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **Hosting**: Netlify (free tier)

## Next Steps - BEFORE You Can Use It

### 1. Configure Environment Variables

You need to create a `.env` file in the project root with your credentials:

```bash
cd lead-tracker-dashboard
```

Create a file named `.env` (copy from `.env.example`) with:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Where to find these:**
- **Supabase URL & Anon Key**: Go to your Supabase project → Settings → API
- **OpenAI API Key**: Go to platform.openai.com → API Keys

### 2. Test Locally

```bash
cd lead-tracker-dashboard
npm run dev
```

Open your browser to `http://localhost:5173` to test the dashboard.

### 3. Deploy to Netlify

#### Option A: Using Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### Option B: Using Netlify Dashboard (Recommended)

1. Push your code to GitHub:
   ```bash
   cd lead-tracker-dashboard
   git init
   git add .
   git commit -m "Initial commit - Lead Tracker Dashboard"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Go to https://app.netlify.com/
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables in Netlify:
   - Go to Site settings → Environment variables
   - Add all three variables from your `.env` file
7. Click "Deploy site"

Your site will be live at a URL like: `https://your-site-name.netlify.app`

## Project Structure

```
lead-tracker-dashboard/
├── src/
│   ├── components/
│   │   ├── FilterBar.tsx         # Search, filter, and sort controls
│   │   ├── Sidebar.tsx           # Left panel with lead list
│   │   ├── MessageBubble.tsx     # Individual chat message
│   │   ├── ChatPanel.tsx         # Right panel with conversation
│   │   └── SuggestButton.tsx     # AI suggestion feature
│   ├── services/
│   │   ├── supabase.ts           # Supabase client and queries
│   │   └── openai.ts             # OpenAI API integration
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Tailwind styles
├── .env.example                  # Environment variable template
├── netlify.toml                  # Netlify deployment config
├── package.json                  # Dependencies
└── README.md                     # Documentation
```

## Important Notes

### Security Consideration
The OpenAI API is currently configured with `dangerouslyAllowBrowser: true` to make it work client-side. This is fine for a simple dashboard, but for production use with sensitive data, consider:
- Moving API calls to a serverless function (Netlify Functions)
- Implementing proper API key management
- Adding rate limiting

### Node.js Version Warning
You may see a warning about Node.js version (22.11.0 vs required 22.12+). The build still works fine, but if you want to eliminate the warning, upgrade Node.js.

### Database Schema
The app expects your Supabase `lead_tracker` table to have these columns:
- `id` (bigint, primary key)
- `username` (text)
- `recent_timestamp` (timestamp with time zone)
- `messages` (text array)
- `latest_message` (text)
- `latest_sender` (text)
- `message_count` (bigint)
- `action_item` (generated text column)

## Troubleshooting

### "Failed to load leads"
- Check your Supabase URL and anon key in `.env`
- Verify your Supabase table name is exactly `lead_tracker`
- Check Row Level Security (RLS) policies in Supabase - ensure reads are allowed

### "Failed to generate suggestions"
- Verify your OpenAI API key is correct
- Check you have credits in your OpenAI account
- Look at browser console for detailed error messages

### Build fails
- Make sure all dependencies are installed: `npm install`
- Clear cache and rebuild: `rm -rf node_modules package-lock.json && npm install`

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Test your Supabase connection separately
4. Ensure your OpenAI API key has proper permissions and credits

## Future Enhancements (Optional)

Consider adding these features later:
- Real-time updates using Supabase subscriptions
- Mark leads as "contacted" or other status updates
- Export conversations to CSV/PDF
- Batch operations (bulk status updates)
- Analytics dashboard (response times, conversion rates)
- Dark mode toggle
