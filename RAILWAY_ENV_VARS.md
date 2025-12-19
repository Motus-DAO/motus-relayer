# Railway Environment Variables

Complete list of all environment variables needed for Railway deployment.

## Required Variables

### Database Configuration

These are **REQUIRED** for the relayer to connect to PostgreSQL:

```
DB_HOST=your-database-host.railway.app
DB_PORT=5432
DB_NAME=motus_relayer
DB_USER=postgres
DB_PASSWORD=your-database-password
```

**How to get these values:**
1. In Railway, add a PostgreSQL service to your project
2. Railway will automatically provide these values
3. Click on the PostgreSQL service → "Variables" tab
4. Copy the values (Railway may auto-inject them, but you can also set them manually)

### Blockchain Configuration

```
RPC_URL=https://forno.celo-sepolia.celo-testnet.org
```

**Default:** `https://forno.celo-sepolia.celo-testnet.org` (Celo Sepolia Testnet)

**Other options:**
- Celo Mainnet: `https://forno.celo.org`
- Custom RPC: Your own RPC endpoint

### Relayer Wallet Configuration

**Option 1: Single Signer (Simplest)**
```
RELAYER_PRIVATE_KEY=your_private_key_without_0x_prefix
```

**Option 2: Multiple Signers (Load Balancing)**
```
RELAYER_PRIVATE_KEY_1=first_private_key_without_0x_prefix
RELAYER_PRIVATE_KEY_2=second_private_key_without_0x_prefix
RELAYER_PRIVATE_KEY_3=third_private_key_without_0x_prefix
```

**Important:**
- Remove the `0x` prefix from your private key
- The relayer wallet needs CELO tokens to pay for gas
- Fund the wallet with at least 1-2 CELO on Celo Sepolia
- You can check balance at: https://celoscan.io/address/YOUR_WALLET_ADDRESS

### Balance Configuration (Optional)

```
MIN_BALANCE_WEI=1000000000000000000
```

**Default:** `1000000000000000000` (1 CELO)

This is the minimum balance required for a signer to be considered active. If a signer's balance drops below this, it will be marked inactive.

### Server Configuration (Optional)

```
PORT=3001
```

**Default:** `3001`

Railway will automatically set this, but you can override if needed.

---

## Complete Railway Setup Example

### Step 1: Add PostgreSQL Service

1. In Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will create a PostgreSQL instance
4. Note the connection details

### Step 2: Set Environment Variables

Go to your relayer service → "Variables" tab and add:

```bash
# Database (from PostgreSQL service)
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=your_password_from_railway

# Blockchain
RPC_URL=https://forno.celo-sepolia.celo-testnet.org

# Relayer Wallet (REQUIRED - get from your wallet)
RELAYER_PRIVATE_KEY=your_private_key_here

# Optional
MIN_BALANCE_WEI=1000000000000000000
PORT=3001
```

### Step 3: Run Database Migrations

After first deployment, run migrations:

**Option A: Via Railway CLI**
```bash
railway run npm run migrate
```

**Option B: Via Railway Dashboard**
1. Go to your relayer service
2. Click "Deployments" → "Latest"
3. Click "Shell" tab
4. Run: `npm run migrate`

### Step 4: Verify Deployment

1. Check health endpoint: `https://your-relayer.railway.app/health`
2. Should return: `{"status":"healthy","hasAvailableSigner":true}`
3. Check signers: `https://your-relayer.railway.app/api/signers`

---

## Quick Reference Table

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_HOST` | ✅ Yes | - | PostgreSQL host |
| `DB_PORT` | ✅ Yes | `5432` | PostgreSQL port |
| `DB_NAME` | ✅ Yes | `motus_relayer` | Database name |
| `DB_USER` | ✅ Yes | `postgres` | Database user |
| `DB_PASSWORD` | ✅ Yes | - | Database password |
| `RPC_URL` | ✅ Yes | Celo Sepolia | Blockchain RPC endpoint |
| `RELAYER_PRIVATE_KEY` | ✅ Yes | - | Relayer wallet private key |
| `MIN_BALANCE_WEI` | ❌ No | `1000000000000000000` | Minimum balance (1 CELO) |
| `PORT` | ❌ No | `3001` | Server port (Railway sets this) |

---

## Security Notes

1. **Never commit private keys** to git
2. **Use Railway's secret management** for sensitive values
3. **Rotate keys regularly** in production
4. **Monitor signer balances** - fund wallets before they run out
5. **Use separate wallets** for testnet and mainnet

---

## Troubleshooting

### "Database connection error"
- Verify all `DB_*` variables are set correctly
- Check PostgreSQL service is running in Railway
- Ensure database exists (Railway creates it automatically)

### "No signer available"
- Check `RELAYER_PRIVATE_KEY` is set
- Verify wallet has CELO tokens
- Check balance is above `MIN_BALANCE_WEI`
- Visit `/api/signers` endpoint to see signer status

### "Transaction submission failed"
- Check relayer wallet has sufficient CELO
- Verify `RPC_URL` is correct and accessible
- Check Railway logs for detailed errors

---

## Getting Your Private Key

If you need to get a private key from MetaMask:

1. Open MetaMask
2. Go to Account Details → Export Private Key
3. Enter your password
4. Copy the private key (remove `0x` prefix if present)
5. Paste into Railway `RELAYER_PRIVATE_KEY` variable

**⚠️ Warning:** Never share your private key or commit it to git!


