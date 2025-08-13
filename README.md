# Vacation Rental Platform - Phase 2

Modern vacation rental platform for Bosnia/Serbia/Croatia/Montenegro with premium features, automation, and growth tools.

## 🚀 Features

### Core Features
- **Listings Management**: CRUD operations with premium highlighting
- **Search & Filters**: Advanced filtering by location, price, amenities, last-minute deals
- **Map View**: Interactive Google Maps integration with clustering
- **User Authentication**: Email/phone verification with OTP
- **Responsive Design**: Mobile-first approach with TailwindCSS

### Premium Features
- **Featured Listings**: Gold badges, auto-expiration, priority sorting
- **Coupons & Discounts**: Global and host-specific coupons with validation
- **Last-Minute Deals**: Automatic discounts for bookings within 7 days
- **Price Calculator**: Dynamic pricing with seasonal/special rates and coupons
- **Wishlist**: Local storage + database sync for logged-in users

### Communication & Support
- **Host-Guest Chat**: Real-time messaging with quick replies
- **AI Chatbot**: FAQ system with knowledge base and support fallback
- **Email Notifications**: Automated reminders and updates
- **Inquiry System**: Direct communication between hosts and guests

### Automation & Integrations
- **n8n Workflows**: Expiry reminders, auto-deactivation, Google Sheets logging
- **Google Sheets**: Activity tracking, payment logging, support tickets
- **Instagram Promotion**: Free first promotion, paid subsequent promotions
- **Concierge Services**: "We post for you" option (+40% on plans)

### Admin & Analytics
- **Moderation System**: Report listings/messages, suspend with reasons
- **Analytics Dashboard**: Views, inquiries, conversions, funnel reports
- **Partner API**: Rate-limited API for approved listings
- **CSV/Drive Export**: Data export for analysis

### Legal & Security
- **GDPR Compliance**: Account deletion, data export, consent logging
- **Legal Pages**: Terms, Privacy, Cookies, Impressum
- **Security**: reCAPTCHA, rate-limiting, email obfuscation
- **Verification**: Email + phone OTP verification

### SEO & Performance
- **Schema.org**: Rich snippets for listings
- **Sitemap & Robots**: Auto-generated SEO files
- **Image Optimization**: WebP, lazy loading, CDN headers
- **Blog System**: SEO-optimized content with related posts

### UX & Accessibility
- **Multi-language**: Bosnian + English (extensible)
- **Dark Mode**: Persistent theme preference
- **Onboarding**: 5-step wizard for new hosts
- **Accessibility**: WCAG compliant with focus management

### Extras
- **PWA**: Installable app with push notifications
- **iCal Export**: Availability calendar export
- **Pro Photography**: Upsell service for professional photos
- **Trust Badges**: Verification and security indicators

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Database**: PostgreSQL with RLS policies
- **Maps**: Google Maps JavaScript API
- **Email**: Resend (or SMTP)
- **SMS**: Twilio/SMSAPI for OTP
- **Monitoring**: Sentry, UptimeRobot
- **Automation**: n8n workflows
- **Analytics**: Custom event tracking
- **PWA**: Service workers, manifest, push notifications

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud Platform account (for Maps API)

### 1. Clone Repository
```bash
git clone <repository-url>
cd vacation-rental-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

Fill in your environment variables:

#### Required Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LANGUAGE=bs

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### Optional Variables (for full functionality)
```env
# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=your_twilio_phone_number

# Google Sheets/Drive
GOOGLE_SHEETS_ID=your_google_sheets_id
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_SERVICE_ACCOUNT_KEY=your_service_account_private_key

# Captcha
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

### 4. Database Setup

#### Run Migrations
```bash
# Connect to your Supabase database and run:
psql -h your_supabase_host -U postgres -d postgres -f database/migrations/001_phase2_core.sql
psql -h your_supabase_host -U postgres -d postgres -f database/migrations/002_phase2_listings_update.sql
psql -h your_supabase_host -U postgres -d postgres -f database/migrations/003_phase2_rls_policies.sql
```

#### Seed Data
```bash
psql -h your_supabase_host -U postgres -d postgres -f database/seeds/phase2_seed.sql
```

### 5. Google Services Setup

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Maps JavaScript API
4. Create API key with restrictions
5. Add to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

#### Google Sheets/Drive (Optional)
1. Create service account in Google Cloud Console
2. Download JSON key file
3. Share Google Sheets/Drive folders with service account email
4. Add credentials to environment variables

### 6. Email Setup (Resend)
1. Sign up at [Resend](https://resend.com/)
2. Create API key
3. Verify domain
4. Add to environment variables

### 7. SMS Setup (Twilio)
1. Sign up at [Twilio](https://twilio.com/)
2. Get Account SID and Auth Token
3. Get phone number
4. Add to environment variables

### 8. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🗄 Database Schema

### Core Tables
- `users` - User profiles and authentication
- `listings` - Property listings with premium features
- `inquiries` - Guest inquiries and bookings
- `payments` - Payment tracking and plans

### Premium Features
- `coupons` & `coupon_redemptions` - Discount system
- `promotions` - Instagram/Google promotion tracking
- `conversations` & `messages` - Chat system
- `wishlists` - User wishlists
- `listing_stats` & `listing_views` - Analytics

### Admin & Moderation
- `listing_moderations` - Moderation actions
- `user_reports` - User reporting system
- `partners` & `partner_api_keys` - Partner integrations
- `service_orders` & `concierge_tasks` - Services

### Content & SEO
- `blog_posts` - Blog system
- `destinations` - Location taxonomy
- `amenities` & `listing_amenities` - Property features
- `trust_badges` - Trust indicators

### Legal & Compliance
- `consent_logs` - GDPR consent tracking
- `account_deletion_logs` - Account deletion records
- `notifications` - System notifications

## 🔧 Configuration

### Feature Flags
Control feature availability via environment variables:
```env
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_MAP=true
NEXT_PUBLIC_ENABLE_WISHLIST=true
NEXT_PUBLIC_ENABLE_COUPONS=true
NEXT_PUBLIC_ENABLE_LAST_MINUTE=true
```

### Pricing Plans
Default pricing (configurable in code):
- Monthly: 25 KM
- Quarterly: 65 KM
- Biannual: 110 KM
- Yearly: 200 KM
- Concierge service: +40%

### Languages
Supported languages (extensible):
- Bosnian (bs) - Default
- English (en)

## 📊 Analytics & Monitoring

### Event Tracking
Track user interactions:
- `view` - Listing views
- `click_phone` - Phone number clicks
- `click_email` - Email clicks
- `send_inquiry` - Inquiry submissions
- `start_checkout` - Payment initiation
- `renew_click` - Plan renewal clicks

### Health Monitoring
- `/api/health` endpoint for uptime checks
- Sentry integration for error tracking
- Database connection monitoring

## 🔒 Security

### Row Level Security (RLS)
All database tables have RLS policies:
- Users can only access their own data
- Admins have full access
- Public read access where appropriate

### Rate Limiting
- API endpoints are rate-limited
- Anti-scrape protection on listing pages
- reCAPTCHA on sensitive forms

### Data Protection
- Email obfuscation on listing cards
- GDPR-compliant data handling
- Secure file upload validation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform

### Production Checklist
- [ ] Set production environment variables
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure CDN (optional)
- [ ] Set up monitoring alerts
- [ ] Test all features
- [ ] Configure backups

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@yourdomain.com
- Documentation: [docs.yourdomain.com](https://docs.yourdomain.com)
- Issues: [GitHub Issues](https://github.com/yourusername/vacation-rental-platform/issues)

## 🔄 Changelog

### Phase 2 (Current)
- Added premium features (coupons, featured listings, last-minute deals)
- Implemented chat system with quick replies
- Added map view with Google Maps integration
- Created wishlist functionality
- Added admin moderation system
- Implemented GDPR compliance
- Added multi-language support
- Created blog system
- Added PWA capabilities
- Implemented automation with n8n

### Phase 1 (MVP)
- Basic listings CRUD
- User authentication
- Search and filters
- Payment system
- Responsive design
- SEO optimization

---

Built with ❤️ for the Balkan vacation rental market
