# MongoDB Atlas Setup - Step by Step

## Quick Start (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" and sign up with email
3. Create organization and project (accept defaults)
4. Choose "M0 Free" tier (free forever)
5. Select AWS, N. Virginia (us-east-1)
6. Create cluster (takes 2-3 minutes)
7. Add your IP to whitelist:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - For production: Add your deployment server IP instead
8. Create database user:
   - Click "Database Access" → "Add New Database User"
   - Username: `svem_user`
   - Password: Generate secure password (copy it!)
   - Built-in Role: "Atlas admin"
9. Get connection string:
   - Click "Clusters" → "Connect" → "Drivers"
   - Copy the connection string (looks like: `mongodb+srv://svem_user:PASSWORD@cluster.mongodb.net/svem?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual password from step 8

## For Backend (Render Deployment)

Add this to your Render environment variables:
```
MONGO_URI=mongodb+srv://svem_user:YOUR_PASSWORD@cluster.mongodb.net/svem?retryWrites=true&w=majority
```

## Database Collections (Auto-created by backend)

The backend automatically creates these collections on first run:
- users
- products
- orders
- reviews
- carts
- wishlists
- otps

No manual setup needed!

## Verify Connection

After deployment, check if database is working:
```bash
curl https://your-backend-url.onrender.com/health | jq .
```

Should show:
```json
{
  "message": "Server is running",
  "timestamp": "2024-01-15T...",
  "database": "connected"
}
```

## Security Notes

- For production, whitelist only your server IP in Network Access
- Use strong passwords (20+ characters)
- Enable MFA on your MongoDB Atlas account
- Rotate passwords every 90 days
- Never commit credentials to git
- Use environment variables for all secrets

## Pricing

- M0 (free): Good for development and testing
- M2/M5 (paid): Starting $9/month for small production apps
- Auto-scaling available for peak loads

## Next Steps

After MongoDB is set up:
1. Update backend .env with MONGO_URI
2. Deploy backend to Render
3. Deploy frontend to Vercel
4. Test the full stack in production
