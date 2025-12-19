# Free Deployment Options for Motus Relayer

Since Railway requires a $5/month fee, here are **completely free alternatives** for deploying your relayer service.

## 🆓 Free Hosting Options

### Option 1: Render (Recommended - Free Tier Available)

**Free Tier Includes:**
- 750 hours/month (enough for 24/7 operation)
- Automatic SSL certificates
- Custom domains
- Auto-deploy from GitHub
- **Note:** Services spin down after 15 minutes of inactivity (free tier limitation)

**Setup Steps:**

1. **Go to [Render](https://render.com)** and sign up (free)

2. **Create a Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `motus-relayer` repository

3. **Configure Build Settings:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** `Node`

4. **Add Environment Variables:**
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

5. **Deploy!** Render will provide a URL like: `https://motus-relayer.onrender.com`

**⚠️ Important:** Free tier services on Render spin down after 15 minutes of inactivity. The first request after spin-down may take 30-60 seconds to wake up. For production, consider upgrading to paid tier ($7/month) or use a "ping" service to keep it awake.

---

### Option 2: Fly.io (Free Tier Available)

**Free Tier Includes:**
- 3 shared-cpu-1x VMs (256MB RAM each)
- 3GB persistent volume storage
- 160GB outbound data transfer
- Global edge network

**Setup Steps:**

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Initialize Fly App:**
   ```bash
   cd relayer
   fly launch
   ```
   - Follow the prompts
   - Don't deploy yet (we need to configure first)

4. **Create `fly.toml` configuration:**
   ```toml
   app = "motus-relayer"
   primary_region = "iad"

   [build]
     dockerfile = "Dockerfile"

   [env]
     PORT = "3001"
     NODE_ENV = "production"

   [[services]]
     internal_port = 3001
     protocol = "tcp"
     processes = ["app"]

     [[services.ports]]
       handlers = ["http"]
       port = 80
       force_https = true

     [[services.ports]]
       handlers = ["tls", "http"]
       port = 443

     [services.concurrency]
       type = "connections"
       hard_limit = 25
       soft_limit = 20

     [[services.http_checks]]
       interval = "10s"
       timeout = "2s"
       grace_period = "5s"
       method = "GET"
       path = "/health"
   ```

5. **Set Secrets (Environment Variables):**
   ```bash
   fly secrets set DB_HOST=your-db-host
   fly secrets set DB_PORT=5432
   fly secrets set DB_NAME=motus_relayer
   fly secrets set DB_USER=your-db-user
   fly secrets set DB_PASSWORD=your-db-password
   fly secrets set RPC_URL=https://forno.celo-sepolia.celo-testnet.org
   fly secrets set RELAYER_PRIVATE_KEY=your_private_key
   ```

6. **Deploy:**
   ```bash
   fly deploy
   ```

**Your app will be available at:** `https://motus-relayer.fly.dev`

---

### Option 3: Vercel (⚠️ Not Recommended for Relayer)

**Free Tier Includes:**
- Unlimited serverless function invocations
- 100GB bandwidth
- Automatic HTTPS
- Global CDN

**⚠️ Important Limitations:**
- **Execution Time Limit:** 10 seconds (free) / 60 seconds (pro)
- **Cold Starts:** 2-5 second delay on first request after inactivity
- **Not Ideal for Relayers:** Blockchain transactions can take 30-60+ seconds
- **Stateless:** Each function invocation is isolated (harder to maintain connections)

**When to Use Vercel:**
- ✅ You're already paying for Vercel Pro
- ✅ Low traffic / development only
- ✅ You're okay with occasional timeouts
- ✅ You want everything in one platform

**Better Alternative:** Use Vercel for your **frontend** (Next.js) and Render/Fly.io for the **relayer** (backend service).

**Note:** If you still want to try Vercel, you'll need to adapt your Express app to work with serverless functions. See `WHAT_IS_RELAYER.md` for more details.

**Setup Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/index.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

3. **Deploy:**
   ```bash
   cd relayer
   vercel
   ```

4. **Set Environment Variables:**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add all required variables

**⚠️ Note:** Vercel serverless functions have execution time limits. For a long-running relayer service, Render or Fly.io are better options.

---

## 🗄️ Free PostgreSQL Database Options

You'll need a PostgreSQL database. Here are free options:

### Option 1: Supabase (Recommended)

**Free Tier:**
- 500MB database storage
- 2GB bandwidth
- Automatic backups
- Built-in connection pooling

**Setup:**
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy connection string or individual credentials:
   - Host: `db.xxxxx.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: (shown in dashboard)

**Connection String Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

---

### Option 2: Neon (Serverless PostgreSQL)

**Free Tier:**
- 3GB storage
- Unlimited compute time (with auto-suspend)
- Branching (database branching like Git)

**Setup:**
1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Copy connection string from dashboard
4. Use the connection details in your environment variables

---

### Option 3: Render PostgreSQL (Free Tier)

**Free Tier:**
- 90 days free trial
- 1GB storage
- Automatic backups

**Setup:**
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Create database
3. Copy connection details from dashboard

**Note:** After 90 days, you'll need to upgrade or migrate to another provider.

---

### Option 4: ElephantSQL (Free Tier)

**Free Tier:**
- 20MB storage (limited, but free forever)
- Good for testing/development

**Setup:**
1. Go to [ElephantSQL](https://www.elephantsql.com)
2. Create a free instance
3. Copy connection details

---

## 📊 Comparison Table

| Platform | Free Tier | Best For | Limitations |
|----------|-----------|----------|-------------|
| **Render** | ✅ Yes | Simple deployment, GitHub integration | Spins down after 15min inactivity |
| **Fly.io** | ✅ Yes | Full control, Docker support, always-on | More setup required |
| **Vercel** | ⚠️ Limited | Serverless (not ideal for relayer) | 60s timeout, cold starts, stateless |
| **Supabase** | ✅ Yes | Database + optional backend | 500MB storage limit |
| **Neon** | ✅ Yes | Modern PostgreSQL, branching | Auto-suspend on inactivity |
| **Railway** | ❌ $5/mo | Easiest setup, best DX | Requires payment |

---

## 🎯 Recommended Free Setup

**If You're Already Paying for Vercel (Frontend):**
- **Frontend:** Vercel (you're already paying - use it!)
- **Relayer:** Render (free) or Fly.io (free)
- **Database:** Supabase (free)

**For Development/Testing (100% Free):**
- **Hosting:** Render (Web Service)
- **Database:** Supabase (PostgreSQL)

**For Production (if staying free):**
- **Hosting:** Fly.io (more reliable, no spin-down)
- **Database:** Neon or Supabase

> 💡 **Best Practice:** Use the right tool for each job. Vercel is perfect for Next.js frontends, but Render/Fly.io are better for Express.js backend services like relayers.

---

## 🚀 Quick Start: Render + Supabase (100% Free)

### Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) → Create project
2. Wait for database to provision (~2 minutes)
3. Go to Settings → Database
4. Copy these values:
   - `DB_HOST`: `db.xxxxx.supabase.co`
   - `DB_PORT`: `5432`
   - `DB_NAME`: `postgres`
   - `DB_USER`: `postgres`
   - `DB_PASSWORD`: (shown in dashboard)

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) → Sign up
2. New + → Web Service
3. Connect GitHub → Select `motus-relayer` repo
4. Configure:
   - **Name:** `motus-relayer`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   ```
   DB_HOST=db.xxxxx.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your_supabase_password
   RPC_URL=https://forno.celo-sepolia.celo-testnet.org
   RELAYER_PRIVATE_KEY=your_private_key
   PORT=3001
   ```
6. Click "Create Web Service"
7. Wait for deployment (~5 minutes)

### Step 3: Run Migrations

Once deployed, run migrations via Render Shell:

1. Go to your service → Shell tab
2. Run: `npm run migrate`

### Step 4: Keep Service Awake (Optional)

Since Render free tier spins down after 15min, you can use a free ping service:

- [UptimeRobot](https://uptimerobot.com) - Free tier: 50 monitors
- [Cron-Job.org](https://cron-job.org) - Free tier: 1 job
- Set up a cron job to ping: `https://your-app.onrender.com/health` every 10 minutes

---

## 🔄 Migrating from Railway to Render

If you already have your relayer on Railway:

1. **Export Environment Variables:**
   - Copy all env vars from Railway dashboard

2. **Create Render Service:**
   - Follow Render setup steps above
   - Paste all environment variables

3. **Update Frontend:**
   - Change `NEXT_PUBLIC_RELAYER_URL` to your new Render URL

4. **Test:**
   - Visit `https://your-app.onrender.com/health`
   - Should return: `{"status":"healthy","hasAvailableSigner":true}`

5. **Delete Railway Service:**
   - Once confirmed working, delete Railway service to avoid charges

---

## 💡 Tips for Free Tier Usage

1. **Monitor Usage:** Keep an eye on resource limits
2. **Optimize:** Use connection pooling for database
3. **Backup:** Export database regularly (free tiers may have data loss risks)
4. **Scale When Needed:** Upgrade to paid tier when you have users/traffic

---

## 🆘 Need Help?

- **Render Issues:** Check [Render Docs](https://render.com/docs)
- **Supabase Issues:** Check [Supabase Docs](https://supabase.com/docs)
- **Database Connection:** Verify firewall allows connections from your hosting provider


