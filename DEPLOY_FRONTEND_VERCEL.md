# Deploy Frontend to Vercel - Step by Step

## Prerequisites
- Frontend code committed to GitHub
- Backend deployed to Render (get the URL)
- Vercel account (optional - can create during deployment)

## Step 1: Push Code to GitHub

Ensure latest code is on main branch:

```bash
cd /vercel/share/v0-project
git add -A
git commit -m "Prepare frontend for production"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Using v0 Dashboard (Easiest)
1. Click "Publish" button in top right of v0 interface
2. Select "Deploy to Vercel"
3. Authorize v0 to access your GitHub
4. Verify repository and branch settings
5. Click "Deploy"

### Option B: Using Vercel Website
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository: `akhilcodes007/venketswara-oil-mill-`
4. Configure project:
   - **Framework Preset**: Other (or Vite if available)
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

## Step 3: Add Environment Variables

After deployment, add environment variables:

1. Go to Vercel project settings
2. Navigate to "Environment Variables"
3. Add this variable:

```
VITE_API_URL=https://svem-backend.onrender.com
```

Replace with your actual Render backend URL.

## Step 4: Trigger New Deployment

After adding environment variables:

1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Select "Redeploy"

This ensures the frontend picks up the new backend URL.

## Step 5: Verify Frontend is Live

1. Copy Vercel project URL (e.g., `https://svem-frontend.vercel.app`)
2. Visit the URL in browser
3. Verify:
   - Home page loads
   - Shop page shows products
   - Navigation works
   - Footer displays

## Step 6: Test API Integration

1. Sign up via OTP on auth page
2. Browse products on shop page
3. Add items to cart
4. Check if data persists

## Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your domain (e.g., `svem.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

## Environment Variables Reference

```
# Backend API URL (required)
VITE_API_URL=https://svem-backend.onrender.com

# Optional - for future features
VITE_RAZORPAY_KEY=your_razorpay_key
```

## Troubleshooting

### Site shows "Build Failed"
- Check build logs in Vercel dashboard
- Ensure `npm run build` works locally
- Verify all dependencies are in package.json

### API calls fail (CORS error)
- Backend not deployed yet or not responding
- Check VITE_API_URL in Vercel environment variables
- Verify backend is running on Render (check health endpoint)

### Products don't load
- Check if backend is responding: `curl https://your-backend-url/api/products`
- Verify VITE_API_URL is correct in frontend
- Check browser console for errors (F12 → Console tab)

### Pages take too long to load
- Cold start on Vercel free tier can be slow
- Upgrade to Vercel Pro for faster builds ($20/month)
- Use Vercel Analytics to identify slow pages

## Performance Optimization

- Vercel automatically optimizes images
- Code splitting is enabled by default
- Build size typically 200-300KB (good)

## Monitoring

1. Enable Vercel Analytics:
   - Project settings → Analytics
   - View Web Vitals (LCP, CLS, FID)

2. Monitor errors:
   - Project settings → Error Tracking
   - Get alerts for failed deployments

## Cost

- **Hobby Plan**: Free for deployment ($0/month)
- **Pro Plan**: $20/month for priority support and features
- No charges for bandwidth

## Next Steps

1. Test entire application (auth, shop, checkout)
2. Configure production payment gateway (Razorpay)
3. Setup email notifications
4. Add custom domain
5. Monitor performance and user feedback
