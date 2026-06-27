# Deploy Backend to Render - Step by Step

## Prerequisites
- Backend code committed to GitHub
- MongoDB Atlas database URL ready (from DEPLOY_MONGODB_ATLAS.md)
- Razorpay API keys (optional, can add later)

## Step 1: Push Code to GitHub

```bash
cd /vercel/share/v0-project
git add -A
git commit -m "Ready for production deployment"
git push origin main
```

## Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

## Step 3: Deploy Backend Service

1. Click "New" → "Web Service"
2. Select your GitHub repository: `akhilcodes007/venketswara-oil-mill-`
3. Configure service:
   - **Name**: `svem-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: Free (sufficient for MVP)
4. Click "Create Web Service"

## Step 4: Add Environment Variables

Go to your service dashboard and add these environment variables:

### Database (Required)
```
MONGO_URI=mongodb+srv://svem_user:PASSWORD@cluster.mongodb.net/svem?retryWrites=true&w=majority
```
(Replace PASSWORD with your MongoDB Atlas password)

### Authentication
```
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-!
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars!
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

### Server
```
NODE_ENV=production
PORT=10000
```

### Email (Optional - using Ethereal for testing)
```
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=ethereal_user@example.com
SMTP_PASS=ethereal_password
SMTP_FROM="Sri Venkateshwara Oil Mill <noreply@svem.com>"
```

### Payments (Optional - add after testing)
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### File Upload (Optional - add after testing)
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 5: Verify Deployment

Once service is deployed:

1. Copy the service URL (e.g., `https://svem-backend.onrender.com`)
2. Test health endpoint:
```bash
curl https://svem-backend.onrender.com/health
```

Should return:
```json
{
  "message": "Server is running",
  "database": "connected"
}
```

3. Test products endpoint:
```bash
curl https://svem-backend.onrender.com/api/products
```

## Step 6: Enable Auto-Deploy

1. In Render dashboard, go to service settings
2. Enable "Auto-deploy on push" for main branch
3. Now any push to main will auto-deploy

## Step 7: Get Backend URL

Copy your service URL. You'll need it for frontend deployment:
```
https://svem-backend.onrender.com
```

## Troubleshooting

### Service won't start
- Check logs in Render dashboard: "Logs" tab
- Verify MongoDB connection string is correct
- Ensure all required environment variables are set

### Database connection fails
- Verify MongoDB Atlas whitelist includes Render IP
- Check MONGO_URI format is correct
- Confirm database user password is correct

### Health check failing
- Service may still be starting (can take 30-60 seconds)
- Check if PORT is set to 10000
- Verify backend/server.js has health endpoint

### Performance issues
- Free tier is suitable for low-traffic MVPs
- Upgrade to paid tier if needed
- Monitor CPU and memory in Render dashboard

## Cost

- **Free tier**: Sufficient for development/MVP ($0/month)
- **Paid tier**: $7/month for better performance
- No charges for stopped services

## Next Steps

After backend is deployed to Render:
1. Copy the backend URL (e.g., https://svem-backend.onrender.com)
2. Deploy frontend to Vercel (see DEPLOY_FRONTEND_VERCEL.md)
3. Configure frontend to use production backend URL
4. Test entire application
