# Sri Venkateshwara Oil Mill - Production Deployment Master Guide

## Quick Reference

- **Repository**: https://github.com/akhilcodes007/venketswara-oil-mill-
- **Frontend**: React + Vite + TanStack Router
- **Backend**: Node.js + Express + MongoDB
- **Database**: MongoDB Atlas (cloud)
- **Frontend Host**: Vercel
- **Backend Host**: Render

## Complete Deployment Checklist (90 minutes)

### Phase 1: Preparation (5 minutes)
- [ ] Read this master guide completely
- [ ] Ensure code is committed to GitHub main branch
- [ ] Have all API keys and passwords ready
- [ ] Create accounts: MongoDB Atlas, Render, Vercel

### Phase 2: Database Setup (15 minutes)
- [ ] Follow: `DEPLOY_MONGODB_ATLAS.md`
- [ ] Create free M0 cluster
- [ ] Create database user `svem_user`
- [ ] Get connection string
- [ ] Test connection locally
- [ ] Whitelist IP addresses

### Phase 3: Backend Deployment (20 minutes)
- [ ] Follow: `DEPLOY_BACKEND_RENDER.md`
- [ ] Connect GitHub to Render
- [ ] Create web service from repository
- [ ] Configure start command
- [ ] Add all environment variables (see `PRODUCTION_ENV_CONFIG.md`)
- [ ] Verify health endpoint works

### Phase 4: Frontend Deployment (15 minutes)
- [ ] Follow: `DEPLOY_FRONTEND_VERCEL.md`
- [ ] Import GitHub repository
- [ ] Configure build settings (npm run build → dist)
- [ ] Add VITE_API_URL environment variable
- [ ] Trigger redeploy to apply env vars
- [ ] Verify frontend loads

### Phase 5: Integration Testing (20 minutes)
- [ ] Follow: `DEPLOYMENT_VERIFICATION.md`
- [ ] Test all endpoints (health, products, auth)
- [ ] Test frontend-backend integration
- [ ] Test complete user flow
- [ ] Verify mobile responsiveness
- [ ] Check performance metrics

### Phase 6: Monitoring Setup (10 minutes)
- [ ] Enable Render metrics
- [ ] Enable Vercel analytics
- [ ] Setup error tracking
- [ ] Configure alerts
- [ ] Document rollback procedures

### Phase 7: Post-Deployment (5 minutes)
- [ ] Monitor logs for 24 hours
- [ ] Document any issues
- [ ] Plan next features
- [ ] Schedule performance review

## Environment Variables Reference

### Backend (Render Dashboard → Environment)

Required:
```
MONGO_URI=mongodb+srv://svem_user:PASSWORD@cluster.mongodb.net/svem?retryWrites=true&w=majority
JWT_SECRET=<32-char-random-string>
JWT_REFRESH_SECRET=<32-char-random-string>
NODE_ENV=production
PORT=10000
ADMIN_EMAIL=shreedhana2005@gmail.com
```

Optional but recommended:
```
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=<ethereal-email>
SMTP_PASS=<ethereal-password>
SMTP_FROM="Sri Venkateshwara Oil Mill <noreply@svem.com>"
```

Future (Razorpay, Cloudinary, Twilio):
```
RAZORPAY_KEY_ID=<key>
RAZORPAY_KEY_SECRET=<secret>
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
```

### Frontend (Vercel Dashboard → Settings → Environment Variables)

Required:
```
VITE_API_URL=https://svem-backend.onrender.com/api
```

Replace `svem-backend` with your actual Render service name.

## Service URLs After Deployment

After deployment, you'll have these URLs:

- **Frontend**: `https://svem-frontend.vercel.app` (or your custom domain)
- **Backend**: `https://svem-backend.onrender.com` (or your custom domain)
- **Database**: MongoDB Atlas cloud (no public URL)

## Verification Commands

Run these to verify everything is working:

```bash
# 1. Check backend health
curl https://your-backend-url/health | jq .

# 2. Check products API
curl https://your-backend-url/api/products | jq '.products | length'

# 3. Check frontend loads
curl -s https://your-frontend-url | grep -i "react"

# 4. Test auth endpoint
curl -X POST https://your-backend-url/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Common Issues & Solutions

### Frontend shows "Cannot find module"
- Check all environment variables are set in Vercel
- Redeploy frontend after adding env vars
- Clear browser cache (Ctrl+Shift+Del)

### API calls fail with CORS error
- Backend needs CORS enabled
- Check backend logs in Render
- Verify frontend URL is whitelisted

### Products don't load
- Check if backend is responding
- Verify VITE_API_URL matches backend URL
- Check network requests in browser DevTools

### Database connection fails
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Confirm database user password

### Render keeps restarting
- Check logs: "Logs" tab in Render dashboard
- Look for error messages
- Usually means missing environment variable or Node crash

### Vercel build fails
- Check build logs: "Deployments" tab
- Verify `npm run build` works locally
- Check for TypeScript errors

## Performance Optimization

### Reduce Build Size
- Tree-shaking is enabled by default
- Images are auto-optimized by Vercel
- Remove unused dependencies regularly

### Improve Load Time
- Products are cached on frontend
- Use browser cache headers
- Consider adding CDN for static assets (future)

### Monitor Performance
- Vercel Web Vitals: Project → Analytics
- Render CPU/Memory: Service → Metrics
- MongoDB performance: Atlas → Metrics

## Security Checklist

- [ ] All secrets in environment variables only
- [ ] No secrets committed to git
- [ ] HTTPS enabled on all URLs
- [ ] IP whitelist configured for MongoDB
- [ ] Branch protection enabled on GitHub
- [ ] API keys rotated every 90 days
- [ ] Backups enabled in MongoDB
- [ ] Error monitoring active
- [ ] Rate limiting configured (future)

## Scaling for Growth

### When Traffic Increases

Database:
- Upgrade from M0 (free) to M2 ($9/month)
- Enable auto-scaling if needed

Backend:
- Upgrade from free tier to paid ($7/month)
- Add more resources as needed
- Consider load balancing (future)

Frontend:
- Vercel Pro ($20/month) for priority support
- Already handles millions of requests/month

## Next Steps After Deployment

1. **Add Custom Domain**
   - Purchase domain (GoDaddy, Namecheap, etc.)
   - Configure DNS in Vercel/Render
   - Enable SSL certificate

2. **Setup Payment Gateway**
   - Get Razorpay production keys
   - Update backend environment
   - Test payment flow

3. **Setup Email Notifications**
   - Configure SendGrid or Brevo
   - Update SMTP variables
   - Test order confirmation emails

4. **Add SMS Notifications (Optional)**
   - Get Twilio account and credentials
   - Update TWILIO_* variables
   - Test SMS notifications

5. **Monitor & Maintain**
   - Check logs daily for first week
   - Monitor error rates
   - Track user feedback
   - Plan feature releases

## Documentation Files

Each step has detailed documentation:

- `DEPLOY_MONGODB_ATLAS.md` - Database setup
- `DEPLOY_BACKEND_RENDER.md` - Backend deployment
- `DEPLOY_FRONTEND_VERCEL.md` - Frontend deployment
- `PRODUCTION_ENV_CONFIG.md` - All environment variables
- `DEPLOYMENT_VERIFICATION.md` - Testing & verification

## Emergency Contacts & Support

### If Something Breaks

1. Check logs first:
   - Render: Service → Logs
   - Vercel: Project → Deployments → Logs
   - MongoDB: Clusters → Metrics → Logs

2. Rollback if needed:
   - Render: Service → Redeploy previous version
   - Vercel: Deployments → Redeploy previous version

3. Get help:
   - Render Support: support@render.com
   - Vercel Support: support@vercel.com
   - MongoDB Support: support@mongodb.com

## Success Metrics

After deployment, aim for:

- **Uptime**: 99.9% (less than 43 minutes downtime per month)
- **Page Load**: < 3 seconds on 4G
- **API Response**: < 200ms average
- **Error Rate**: < 0.1% of requests
- **Database**: 0 connection errors

## Final Checklist Before Going Live

- [ ] All environment variables set correctly
- [ ] Health check passing
- [ ] Products loading from API
- [ ] Auth flow working
- [ ] Cart and checkout tested
- [ ] Mobile responsive verified
- [ ] Performance metrics good
- [ ] Error handling works
- [ ] Backups enabled
- [ ] Monitoring setup
- [ ] Team trained on production access
- [ ] Incident response plan ready

## Additional Resources

- React Docs: https://react.dev
- Node.js Docs: https://nodejs.org/docs
- Express Docs: https://expressjs.com
- MongoDB Docs: https://docs.mongodb.com
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

---

**Status**: Ready for Production Deployment

**Last Updated**: January 2024

**Deployment Duration**: 60-90 minutes

**Required Effort**: Low (mostly configuration, no coding)

**Risk Level**: Low (free tiers, can rollback easily)

Good luck with your deployment!
