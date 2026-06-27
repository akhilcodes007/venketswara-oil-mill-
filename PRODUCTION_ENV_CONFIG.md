# Production Environment Configuration Guide

## Overview

This guide walks you through configuring all environment variables for production deployment across MongoDB Atlas, Render (backend), and Vercel (frontend).

## 1. Backend Environment Variables (Render)

Go to your Render dashboard → Backend Service → Environment:

### Required Variables

#### Database
```
MONGO_URI=mongodb+srv://svem_user:PASSWORD@cluster.mongodb.net/svem?retryWrites=true&w=majority
NODE_ENV=production
PORT=10000
```

#### Authentication
```
JWT_SECRET=<generate-32-char-random-string>
JWT_REFRESH_SECRET=<generate-32-char-random-string>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

**How to generate secure secrets:**
```bash
# On Mac/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or use online generator: https://generate-random.org/random-base64
```

**Store safely:**
- Copy each generated secret
- Paste into Render environment variables
- NEVER commit to git
- NEVER share or expose in logs

#### Admin Configuration
```
ADMIN_EMAIL=shreedhana2005@gmail.com
```

### Optional Variables (Add Later)

#### Email Notifications
```
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=<ethereal-user@email.com>
SMTP_PASS=<ethereal-password>
SMTP_FROM="Sri Venkateshwara Oil Mill <noreply@svem.com>"
```

To get Ethereal credentials:
1. Visit https://ethereal.email
2. Click "Create Ethereal Account"
3. Copy username and password
4. Use for development (doesn't actually send emails)

For production email:
- Use SendGrid (free tier: 100 emails/day)
- Or AWS SES ($.10 per 1000 emails)
- Or Brevo (20 emails/day free)

#### Razorpay (Payments)
```
RAZORPAY_KEY_ID=rzp_test_xxxxxx  (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_SECRET=xxxxxx
```

#### SMS & WhatsApp (Optional)
```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
TWILIO_WHATSAPP_NUMBER=+1...
```

#### Image Upload (Cloudinary)
```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Get Cloudinary credentials:
1. Sign up at https://cloudinary.com
2. Free tier: 25GB storage, 5M transformations/month
3. Copy API credentials from Settings

## 2. Frontend Environment Variables (Vercel)

Go to your Vercel project → Settings → Environment Variables:

### Required Variables

#### Backend API URL
```
VITE_API_URL=https://svem-backend.onrender.com/api
```

Replace `svem-backend` with your actual Render service name.

### Optional Variables

```
VITE_RAZORPAY_KEY=rzp_live_xxxxxx
```

## 3. Verification Checklist

After setting all variables, verify everything works:

### Backend Health Check
```bash
curl https://svem-backend.onrender.com/health
```

Should return:
```json
{
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2024-01-15..."
}
```

### Frontend Health Check
1. Visit your Vercel URL
2. Open browser console (F12)
3. Check for errors
4. Test API calls:
   - Load shop page (should show products)
   - Try auth (should communicate with backend)

### Database Verification
```bash
# Install MongoDB CLI
brew install mongodb-community

# Connect to your cluster
mongosh "mongodb+srv://svem_user:PASSWORD@cluster.mongodb.net/svem"

# List collections
show collections

# See if data exists
db.products.count()
```

## 4. Security Best Practices

### Secrets Management

- **Never commit secrets**: Add `.env` to `.gitignore`
- **Use environment variables**: All secrets via env vars only
- **Rotate periodically**: Change JWT secrets every 3-6 months
- **Limit access**: Only share URLs with authorized team members
- **Monitor usage**: Check Render/Vercel logs for suspicious activity

### Access Control

- **MongoDB**: Use IP whitelist (Render IP only in production)
- **Vercel**: Use branch protection and require approvals
- **Render**: Enable automatic deployments only from main branch
- **GitHub**: Use branch protection rules

### Monitoring

- Enable Render logs monitoring
- Setup Vercel error tracking
- Monitor MongoDB backup status
- Check monthly usage quotas

## 5. Scaling Configuration

As traffic grows:

### Database
- Free tier: Good for MVP
- M2 ($9/month): 10GB storage, good for small apps
- M5/M10: Better for production with users in 100s+

### Backend
- Free tier: 0.5 CPU, 512MB RAM
- Paid tier ($7+): Better for concurrent users 50+

### Frontend
- Hobby (Free): Unlimited projects, 100GB/month bandwidth
- Pro ($20/month): Priority support, better build performance

## 6. Troubleshooting

### "API connection failed"
- Check `VITE_API_URL` in Vercel matches your Render URL
- Verify Render backend is running (check logs)
- Clear browser cache

### "Database connection refused"
- Check `MONGO_URI` is correct
- Verify IP whitelist in MongoDB Atlas includes Render IP
- Check password has no special characters causing escaping issues

### "Environment variables not loading"
- Verify variables are marked as secret if needed
- Redeploy after adding/changing variables
- Check variable names (case-sensitive)

### "CORS errors"
- Backend needs to allow frontend domain
- Check backend CORS configuration in `server.js`
- May need to update CORS whitelist for production domain

## 7. Going Live Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Backend deployed to Render with all env vars
- [ ] Frontend deployed to Vercel with VITE_API_URL
- [ ] Health checks passing
- [ ] Products loading from API
- [ ] Auth flow working
- [ ] Cart and checkout operational
- [ ] Payment gateway configured (Razorpay)
- [ ] Email notifications working
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate enabled
- [ ] Backups enabled in MongoDB
- [ ] Error monitoring setup
- [ ] Analytics enabled

## Support & Resources

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Environment Variables Best Practices: https://12factor.net/config
