# Deployment Checklist

Use this checklist to prepare the Sri Venkateshwara Oil Mill e-commerce platform for production deployment.

## Database Setup ⚙️

- [ ] Create MongoDB Atlas account (free tier M0)
- [ ] Create cluster in desired region
- [ ] Create database user with strong password
- [ ] Configure Network Access (allow required IPs)
- [ ] Get MongoDB Atlas connection string
- [ ] Test connection locally:
  ```bash
  cd backend
  MONGO_URI="your_connection_string" npm run dev
  ```
- [ ] Verify backend logs show `[MongoDB] Connected`

## Environment Variables 🔐

### Backend (.env or server config)
- [ ] `MONGO_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Generate with `openssl rand -base64 32`
- [ ] `JWT_REFRESH_SECRET` - Generate with `openssl rand -base64 32`
- [ ] `ADMIN_EMAIL` - Set to authorized admin email
- [ ] `NODE_ENV` - Set to "production"
- [ ] `PORT` - 5000 (or adjust for your hosting)

### Frontend (.env.production)
- [ ] `VITE_API_URL` - Backend API URL (e.g., https://api.yourdomain.com)
- [ ] `VITE_SOCKET_URL` - Backend Socket.io URL (same domain)

### Email Service (Optional but Recommended)
- [ ] Choose email provider:
  - SendGrid (recommended for scale)
  - Gmail SMTP (simple setup)
  - AWS SES
  - Mailgun
- [ ] `SMTP_HOST` - Your provider's SMTP host
- [ ] `SMTP_PORT` - Usually 587 or 465
- [ ] `SMTP_USER` - Your email account
- [ ] `SMTP_PASS` - Generated password or API key
- [ ] `SMTP_FROM` - From email address

### Payment Gateway (Razorpay)
- [ ] Create Razorpay account (Indian business required)
- [ ] Get test API keys (for staging)
- [ ] Get live API keys (for production)
- [ ] `RAZORPAY_KEY_ID` - Your key ID
- [ ] `RAZORPAY_KEY_SECRET` - Your secret key

### SMS/WhatsApp (Twilio - Optional)
- [ ] Create Twilio account (if using SMS)
- [ ] `TWILIO_ACCOUNT_SID` - Account SID
- [ ] `TWILIO_AUTH_TOKEN` - Auth token
- [ ] `TWILIO_PHONE_NUMBER` - Verified phone number
- [ ] `TWILIO_WHATSAPP_NUMBER` - WhatsApp number

### Image Hosting (Cloudinary)
- [ ] Create Cloudinary account
- [ ] `CLOUDINARY_CLOUD_NAME` - Your cloud name
- [ ] `CLOUDINARY_API_KEY` - API key
- [ ] `CLOUDINARY_API_SECRET` - API secret

## Backend Deployment 🚀

### Build & Test
- [ ] Run tests (if available):
  ```bash
  cd backend
  npm test
  ```
- [ ] Build for production:
  ```bash
  npm run build
  # (if applicable)
  ```
- [ ] Verify health endpoint works:
  ```bash
  curl https://your-backend-url/health
  ```

### Choose Hosting Platform
- [ ] Option 1: Vercel (Node.js support)
  - [ ] Connect GitHub repository
  - [ ] Set environment variables
  - [ ] Deploy with `git push`
  
- [ ] Option 2: Render (Recommended for Node)
  - [ ] Connect GitHub repository
  - [ ] Create new Web Service
  - [ ] Set environment variables
  - [ ] Set start command: `npm run start` or `node server.js`

- [ ] Option 3: Railway
  - [ ] Connect GitHub repository
  - [ ] Set environment variables
  - [ ] Deploy

- [ ] Option 4: AWS EC2/Heroku/DigitalOcean/Linode
  - [ ] Provision server
  - [ ] Install Node.js
  - [ ] Clone repository
  - [ ] Install dependencies: `npm install`
  - [ ] Set environment variables
  - [ ] Use PM2 or systemd for process management
  - [ ] Setup reverse proxy (Nginx)

### Post-Deployment
- [ ] Test all API endpoints:
  ```bash
  curl https://your-backend-url/api/products
  curl https://your-backend-url/api/auth/me
  ```
- [ ] Monitor logs for errors
- [ ] Setup uptime monitoring (UptimeRobot or similar)
- [ ] Setup error logging (Sentry or similar)

## Frontend Deployment 🎨

### Build & Optimize
- [ ] Build production bundle:
  ```bash
  npm run build
  ```
- [ ] Test production build locally:
  ```bash
  npm run preview
  ```
- [ ] Verify bundle size is reasonable:
  ```bash
  npm run build
  # Check dist/ folder size
  ```

### Deploy to Vercel (Recommended)
- [ ] Connect GitHub repository to Vercel
- [ ] Set environment variables:
  - `VITE_API_URL=https://your-backend-url/api`
  - `VITE_SOCKET_URL=https://your-backend-url`
- [ ] Vercel automatically deploys on git push
- [ ] Custom domain setup:
  - [ ] Add custom domain in Vercel dashboard
  - [ ] Update DNS records

### Alternative: Deploy to Netlify
- [ ] Connect GitHub repository to Netlify
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `dist`
- [ ] Set environment variables
- [ ] Configure redirects for SPA (create `_redirects` file)

### Post-Deployment
- [ ] Test all frontend pages load
- [ ] Verify API communication works
- [ ] Test responsive design on mobile
- [ ] Check performance with Lighthouse
- [ ] Verify SSL certificate is valid

## Domain & DNS 🌐

- [ ] Register domain name
- [ ] Verify domain ownership
- [ ] Update DNS records:
  - [ ] Frontend: Point to Vercel/Netlify CNAME
  - [ ] Backend API: Point to backend server (subdomain)
  - [ ] Example: api.yourdomain.com → backend URL
  - [ ] Example: www.yourdomain.com → frontend URL

## Security & SSL 🔒

- [ ] Enable HTTPS everywhere
- [ ] Generate SSL certificates (Let's Encrypt is free)
- [ ] Enable HSTS header
- [ ] Setup CORS properly (allow your domain only)
- [ ] Review environment variables (no secrets in code)
- [ ] Enable rate limiting
- [ ] Setup firewall rules
- [ ] Enable HTTPS redirects

## Performance & Monitoring 📊

- [ ] Setup monitoring dashboard:
  - [ ] Backend uptime monitoring
  - [ ] Database performance metrics
  - [ ] Error tracking (Sentry)
  - [ ] Analytics (optional)

- [ ] Configure alerts for:
  - [ ] Server down
  - [ ] High error rates
  - [ ] Database issues
  - [ ] Payment failures

- [ ] Setup backups:
  - [ ] MongoDB Atlas backups (enabled by default)
  - [ ] Regular database exports
  - [ ] Code repository backups

## Testing & Verification ✅

### Functional Testing
- [ ] Auth flow: Sign up with email → OTP → Login
- [ ] Product browsing: Search, filter, sort
- [ ] Cart operations: Add, remove, update quantities
- [ ] Checkout flow: Enter address, place order
- [ ] Order tracking: View order status
- [ ] Admin dashboard: View all orders, update status
- [ ] Reviews: Submit and view product reviews

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Mobile responsiveness verified
- [ ] No console errors or warnings

### Security Testing
- [ ] HTTPS working
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Authentication tokens secure

## Documentation 📝

- [ ] README updated with:
  - [ ] Setup instructions
  - [ ] Deployment steps
  - [ ] API documentation
  - [ ] Environment variables guide

- [ ] Knowledge transfer:
  - [ ] Documentation for team
  - [ ] API documentation accessible
  - [ ] Admin guide for operations
  - [ ] Troubleshooting guide

## Launch Preparation 🎉

- [ ] Announce launch date
- [ ] Test with actual users (staging)
- [ ] Get feedback
- [ ] Fix critical issues
- [ ] Create launch announcement
- [ ] Setup customer support
- [ ] Monitor closely first week

## Post-Launch Monitoring 🔍

For first week after launch:
- [ ] Monitor error logs daily
- [ ] Check performance metrics
- [ ] Respond to user feedback
- [ ] Fix any critical bugs immediately
- [ ] Monitor server resources

## Rollback Plan 🔙

- [ ] Document current production version
- [ ] Keep previous stable version accessible
- [ ] Document rollback procedure
- [ ] Test rollback process before needed
- [ ] Communicate plan to team

---

## Quick Reference

### Most Important Steps
1. **Database**: Setup MongoDB Atlas with proper credentials
2. **Backend Env**: Set JWT secrets and MongoDB URI
3. **Frontend Env**: Set VITE_API_URL to backend domain
4. **Deploy Backend**: Use Render or Railway
5. **Deploy Frontend**: Use Vercel or Netlify
6. **DNS**: Point domain to your servers
7. **SSL**: Enable HTTPS
8. **Test**: Verify all flows work end-to-end

### Estimated Timeline
- Database setup: 15 minutes
- Environment configuration: 10 minutes
- Backend deployment: 10-30 minutes (depends on platform)
- Frontend deployment: 5-15 minutes
- DNS propagation: 5-48 hours
- Testing: 30-60 minutes
- **Total**: 1-3 hours + DNS wait

### Support Resources
- MongoDB Atlas Docs: docs.mongodb.com/atlas
- Vercel Docs: vercel.com/docs
- Express.js Docs: expressjs.com
- React Docs: react.dev
- Vite Docs: vitejs.dev

---

**Status**: Ready for deployment
**Last Updated**: June 27, 2026
**Project**: Sri Venkateshwara Oil Mill E-Commerce
