# Deploying Motus Relayer to Separate Repository

This guide helps you push the relayer service to a separate GitHub repository for independent deployment.

## Step 1: Create New GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `motus-relayer`)
3. **Don't** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL (e.g., `https://github.com/YOUR_USERNAME/motus-relayer.git`)

## Step 2: Initialize Git in Relayer Folder

Run these commands in the `relayer` directory:

```bash
cd relayer

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Motus Relayer Service"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/motus-relayer.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 3: Verify Push

Check your GitHub repository - you should see all the relayer files.

## Step 4: Deploy to Railway/Render

### Option A: Railway (Recommended)

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `motus-relayer` repository
5. Railway will auto-detect Node.js
6. Add environment variables in Railway dashboard:
   ```
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_NAME=motus_relayer
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   RPC_URL=https://forno.celo-sepolia.celo-testnet.org
   RELAYER_PRIVATE_KEY=your_private_key
   PORT=3001
   ```
7. Railway will provide a URL like: `https://motus-relayer.railway.app`
8. Use this URL in your frontend: `NEXT_PUBLIC_RELAYER_URL=https://motus-relayer.railway.app`

### Option B: Render

1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select `motus-relayer` repository
5. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables (same as Railway)
7. Render will provide a URL like: `https://motus-relayer.onrender.com`

## Step 5: Set Up Database

You'll need a PostgreSQL database. Options:

- **Railway**: Add a PostgreSQL service in the same project
- **Supabase**: Free tier available at https://supabase.com
- **Neon**: Free tier at https://neon.tech
- **Render**: Add a PostgreSQL database service

After setting up the database, update the `DB_*` environment variables in your deployment platform.

## Step 6: Run Migrations

After deployment, run migrations:

```bash
# Via Railway CLI
railway run npm run migrate

# Or via Render shell
npm run migrate
```

Or add a migration step to your deployment process.

## Step 7: Update Frontend

Update your frontend environment variables (Vercel) with the deployed relayer URL:

```
NEXT_PUBLIC_RELAYER_URL=https://your-relayer-url.railway.app
```

## Troubleshooting

### Database Connection Issues
- Verify database credentials are correct
- Check if database allows connections from your deployment platform
- Ensure database is accessible (not blocked by firewall)

### Relayer Not Starting
- Check logs in Railway/Render dashboard
- Verify all environment variables are set
- Ensure `RELAYER_PRIVATE_KEY` is correct
- Check that the relayer wallet has CELO tokens

### Health Check Failing
- Visit `https://your-relayer-url.com/health`
- Should return: `{"status":"healthy","hasAvailableSigner":true}`
- If not, check logs for errors

## Next Steps

1. Monitor relayer health: `GET /health`
2. Check signer status: `GET /api/signers`
3. Monitor transaction success rates
4. Set up alerts for low balances
