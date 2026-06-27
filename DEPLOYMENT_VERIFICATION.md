# Deployment Verification & Testing Guide

## Pre-Deployment Checklist

Before you start, ensure:

- [ ] MongoDB Atlas account created with cluster
- [ ] Backend code pushed to GitHub main branch
- [ ] Render account created and connected to GitHub
- [ ] Vercel account created and connected to GitHub
- [ ] All API keys and secrets generated

## Step 1: Verify MongoDB Atlas

### Check Cluster Status
1. Go to https://cloud.mongodb.com
2. Click "Database" → "Clusters"
3. Verify cluster shows green status
4. Click "Connect" → "Drivers" to verify connection string format

### Test Connection
```bash
# Using MongoDB CLI
mongosh "mongodb+srv://svem_user:PASSWORD@cluster.mongodb.net/svem"

# In mongosh shell
show databases
show collections
```

Expected: At least 'admin' and 'config' databases visible

## Step 2: Verify Backend (Render)

### Check Deployment Status
1. Go to https://dashboard.render.com
2. Select your backend service
3. Verify status shows "Live"
4. Copy your service URL (e.g., `https://svem-backend.onrender.com`)

### Test Health Endpoint
```bash
curl https://your-backend-url/health | jq .
```

Expected response:
```json
{
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Test Products Endpoint
```bash
curl https://your-backend-url/api/products | jq '.products | length'
```

Expected: Number > 0 (showing products count)

### Test Auth Endpoint
```bash
curl -X POST https://your-backend-url/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected:
```json
{
  "message": "OTP sent successfully",
  "email": "test@example.com"
}
```

### Check Logs for Errors
1. In Render dashboard, go to "Logs" tab
2. Scroll to bottom to see latest activity
3. Look for any error messages
4. Common errors:
   - `MongoServerError`: Database connection issue
   - `ERR_MODULE_NOT_FOUND`: Missing dependencies
   - `ENOENT`: Environment variable missing

## Step 3: Verify Frontend (Vercel)

### Check Deployment Status
1. Go to https://vercel.com/dashboard
2. Select your frontend project
3. Verify status shows "Ready"
4. Copy your project URL (e.g., `https://svem-frontend.vercel.app`)

### Test Frontend Loading
```bash
curl -s https://your-frontend-url | head -20
```

Should return HTML with React app

### Test Frontend in Browser
1. Open https://your-frontend-url in browser
2. Wait for page to load (30 seconds on first load)
3. Verify:
   - Page renders without white screen
   - Navigation bar visible
   - Hero section displays
   - Logo and brand name visible

### Check Build Logs
1. In Vercel dashboard, go to "Deployments"
2. Click on latest deployment
3. Check "Build Logs" for errors
4. Common issues:
   - TypeScript errors
   - Missing environment variables
   - Build timeout (increase to 900 seconds in settings)

## Step 4: Test Frontend-Backend Integration

### Test Shop Page
1. Navigate to https://your-frontend-url/shop
2. Wait for products to load (should take <3 seconds)
3. Verify:
   - Products display with images
   - Product prices show
   - Category filters work
   - Add to cart button appears

### Test Auth Page
1. Navigate to https://your-frontend-url/auth
2. Enter test email: `test@example.com`
3. Click "Send verification code"
4. Check if backend logs show OTP sent
5. Expected in logs: `OTP sent to test@example.com`

### Test API Calls
Open browser console (F12) and run:
```javascript
// Test backend connectivity
fetch('https://your-backend-url/api/products')
  .then(r => r.json())
  .then(d => console.log('Products loaded:', d.products.length))
  .catch(e => console.error('Error:', e))
```

### Monitor Network Requests
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Reload page
4. Check all requests:
   - HTML file loads (status 200)
   - CSS/JS bundle loads (status 200)
   - API requests to backend (status 200)
   - No failed requests (red status codes)

## Step 5: Full End-to-End Test

### Complete User Flow
1. Open https://your-frontend-url
2. Sign in with OTP:
   - Enter email
   - Click "Send verification code"
   - Check for OTP in email or backend logs
   - Enter OTP on page
3. Browse shop:
   - Click "Enter Shop"
   - Verify products load
   - Click product to view details
4. Add to cart:
   - Click "Add to Cart"
   - Check cart icon updates
5. View cart:
   - Click cart icon
   - Verify items appear
6. Checkout:
   - Click "Proceed to Checkout"
   - Verify checkout form loads

### Test Dashboard
1. Navigate to /dashboard
2. Should see order history (empty initially)
3. Should see profile information
4. Verify wishlist page works (/wishlist)

## Step 6: Performance Testing

### Page Load Time
```bash
curl -w "@curl-format.txt" -o /dev/null -s https://your-frontend-url
```

Expected metrics:
- First Byte: < 500ms
- Total Time: < 2 seconds

### Test on Different Devices
1. Mobile (375x667):
   ```bash
   agent-browser set device "iPhone 12"
   agent-browser open "https://your-frontend-url"
   agent-browser screenshot mobile.png
   ```

2. Tablet (768x1024):
   ```bash
   agent-browser set device "iPad Pro"
   agent-browser open "https://your-frontend-url"
   agent-browser screenshot tablet.png
   ```

3. Desktop (1920x1080):
   ```bash
   agent-browser set viewport 1920 1080
   agent-browser open "https://your-frontend-url"
   agent-browser screenshot desktop.png
   ```

## Step 7: Security Verification

### Check HTTPS
All URLs should start with `https://`:
- https://svem-frontend.vercel.app ✓
- https://svem-backend.onrender.com ✓

### Verify No Secrets Exposed
Check browser console for warnings about exposed secrets:
```javascript
// Check if secrets are in window object
console.log(Object.keys(window).filter(k => k.includes('SECRET')))
// Should return empty array
```

### Test Authentication
1. Sign in successfully
2. Verify JWT token stored in localStorage
3. Refresh page - should stay logged in
4. Clear localStorage - should be logged out

### CORS Testing
1. Try to access backend from frontend
2. Verify no CORS errors in console
3. If errors appear:
   - Backend needs CORS configuration
   - Frontend URL needs to be whitelisted

## Step 8: Error Handling

### Test Error Scenarios

#### Network Error
1. Stop internet connection
2. Try to load shop page
3. Should show graceful error message

#### API Error
```bash
curl https://your-backend-url/api/invalid-endpoint
```
Should return proper error response, not crash

#### Database Error
1. Temporarily disable MongoDB connection in backend
2. Call any API endpoint
3. Should return error message, not crash server

## Step 9: Monitoring Setup

### Enable Render Metrics
1. In Render dashboard → Metrics tab
2. Monitor:
   - CPU usage (should be < 50% normally)
   - Memory usage (should be < 300MB)
   - Request count
   - Error rate (should be 0%)

### Enable Vercel Analytics
1. In Vercel project settings → Analytics
2. View:
   - Web Vitals (LCP, FCP, CLS)
   - Response times
   - Error tracking

### Setup Error Notifications
1. Enable Render notifications
2. Enable Vercel notifications
3. Set up email alerts for:
   - Deployment failures
   - Performance degradation
   - Error spikes

## Step 10: Deployment Success Criteria

Mark deployment successful when:

- [ ] Health check returns "database": "connected"
- [ ] All products load from API
- [ ] Auth OTP flow works
- [ ] Shop page displays products
- [ ] Cart functionality works
- [ ] No console errors
- [ ] No network failures
- [ ] HTTPS working on all URLs
- [ ] Mobile-responsive design intact
- [ ] Page loads in < 3 seconds
- [ ] All environment variables set
- [ ] Logs show no errors
- [ ] Performance metrics good (LCP < 2.5s, CLS < 0.1)

## Rollback Procedure

If something breaks in production:

### Quick Rollback (Vercel)
1. Go to Deployments tab
2. Find last known good deployment
3. Click "..." → "Redeploy"
4. Takes 1-2 minutes

### Rollback Backend (Render)
1. Go to Service → Settings
2. Find last deployment
3. Click "Redeploy"

### Rollback Database
If data was corrupted:
1. MongoDB Atlas → Backups
2. Restore from previous backup
3. Takes 5-10 minutes

## Post-Deployment Actions

- [ ] Monitor logs for 24 hours
- [ ] Setup uptime monitoring
- [ ] Configure backup schedule
- [ ] Document deployment process
- [ ] Update runbook for future deploys
- [ ] Train team on production access
- [ ] Setup incident response procedure
- [ ] Schedule performance review
