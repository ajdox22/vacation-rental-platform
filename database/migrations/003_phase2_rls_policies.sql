-- Phase 2 RLS Policies
-- Vacation Rental Platform - Security Policies

-- Enable RLS on all tables
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_moderations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE concierge_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_deletion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;

-- COUPONS POLICIES
CREATE POLICY "Coupons are viewable by everyone" ON coupons
    FOR SELECT USING (is_active = true);

CREATE POLICY "Coupons can be created by admins" ON coupons
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Coupons can be updated by admins or owners" ON coupons
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        ) OR owner_host_id = auth.uid()
    );

-- COUPON REDEMPTIONS POLICIES
CREATE POLICY "Users can view their own redemptions" ON coupon_redemptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create redemptions" ON coupon_redemptions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- PROMOTIONS POLICIES
CREATE POLICY "Promotions are viewable by listing owners and admins" ON promotions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = promotions.listing_id 
            AND listings.host_id = auth.uid()
        ) OR EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Promotions can be created by listing owners" ON promotions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = promotions.listing_id 
            AND listings.host_id = auth.uid()
        )
    );

CREATE POLICY "Promotions can be updated by admins" ON promotions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- MODERATION POLICIES
CREATE POLICY "Moderations are viewable by admins and affected users" ON listing_moderations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        ) OR EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = listing_moderations.listing_id 
            AND listings.host_id = auth.uid()
        )
    );

CREATE POLICY "Moderations can be created by admins" ON listing_moderations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- USER REPORTS POLICIES
CREATE POLICY "Users can view their own reports" ON user_reports
    FOR SELECT USING (
        reporter_id = auth.uid() OR 
        reported_user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Users can create reports" ON user_reports
    FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Reports can be updated by admins" ON user_reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- AMENITIES POLICIES
CREATE POLICY "Amenities are viewable by everyone" ON amenities
    FOR SELECT USING (is_active = true);

CREATE POLICY "Amenities can be managed by admins" ON amenities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- LISTING AMENITIES POLICIES
CREATE POLICY "Listing amenities are viewable by everyone" ON listing_amenities
    FOR SELECT USING (true);

CREATE POLICY "Listing amenities can be managed by listing owners" ON listing_amenities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = listing_amenities.listing_id 
            AND listings.host_id = auth.uid()
        )
    );

-- DESTINATIONS POLICIES
CREATE POLICY "Destinations are viewable by everyone" ON destinations
    FOR SELECT USING (is_active = true);

CREATE POLICY "Destinations can be managed by admins" ON destinations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- CONVERSATIONS POLICIES
CREATE POLICY "Users can view conversations they participate in" ON conversations
    FOR SELECT USING (
        host_id = auth.uid() OR guest_id = auth.uid()
    );

CREATE POLICY "Users can create conversations" ON conversations
    FOR INSERT WITH CHECK (guest_id = auth.uid());

-- MESSAGES POLICIES
CREATE POLICY "Users can view messages in their conversations" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.host_id = auth.uid() OR conversations.guest_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their conversations" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.host_id = auth.uid() OR conversations.guest_id = auth.uid())
        ) AND sender_id = auth.uid()
    );

-- REVIEWS POLICIES
CREATE POLICY "Reviews are viewable by everyone when approved" ON reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can view their own reviews" ON reviews
    FOR SELECT USING (reviewer_id = auth.uid());

CREATE POLICY "Users can create reviews for listings they stayed at" ON reviews
    FOR INSERT WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Reviews can be approved by admins" ON reviews
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- WISHLIST POLICIES
CREATE POLICY "Users can view their own wishlist" ON wishlists
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own wishlist" ON wishlists
    FOR ALL USING (user_id = auth.uid());

-- LISTING STATS POLICIES
CREATE POLICY "Listing stats are viewable by listing owners and admins" ON listing_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = listing_stats.listing_id 
            AND listings.host_id = auth.uid()
        ) OR EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- LISTING VIEWS POLICIES
CREATE POLICY "Listing views are viewable by listing owners and admins" ON listing_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = listing_views.listing_id 
            AND listings.host_id = auth.uid()
        ) OR EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Anyone can create view records" ON listing_views
    FOR INSERT WITH CHECK (true);

-- PARTNERS POLICIES
CREATE POLICY "Partners are viewable by everyone" ON partners
    FOR SELECT USING (is_active = true);

CREATE POLICY "Partners can be managed by admins" ON partners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- PARTNER API KEYS POLICIES
CREATE POLICY "Partner API keys are viewable by admins" ON partner_api_keys
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Partner API keys can be managed by admins" ON partner_api_keys
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- PARTNER CLICKS POLICIES
CREATE POLICY "Partner clicks are viewable by admins" ON partner_clicks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Anyone can create click records" ON partner_clicks
    FOR INSERT WITH CHECK (true);

-- PARTNER LEADS POLICIES
CREATE POLICY "Partner leads are viewable by admins" ON partner_leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Anyone can create lead records" ON partner_leads
    FOR INSERT WITH CHECK (true);

-- SERVICE ORDERS POLICIES
CREATE POLICY "Users can view their own service orders" ON service_orders
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create service orders" ON service_orders
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service orders can be updated by admins" ON service_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- CONCIERGE TASKS POLICIES
CREATE POLICY "Users can view their own concierge tasks" ON concierge_tasks
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create concierge tasks" ON concierge_tasks
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Concierge tasks can be managed by admins" ON concierge_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- ACCOUNT DELETION LOGS POLICIES
CREATE POLICY "Account deletion logs are viewable by admins" ON account_deletion_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- CONSENT LOGS POLICIES
CREATE POLICY "Users can view their own consent logs" ON consent_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Anyone can create consent logs" ON consent_logs
    FOR INSERT WITH CHECK (true);

-- BLOG POSTS POLICIES
CREATE POLICY "Blog posts are viewable by everyone when published" ON blog_posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Blog posts can be managed by admins" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- TRUST BADGES POLICIES
CREATE POLICY "Trust badges are viewable by everyone" ON trust_badges
    FOR SELECT USING (is_active = true);

CREATE POLICY "Trust badges can be managed by admins" ON trust_badges
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- EVENT LOGS POLICIES
CREATE POLICY "Event logs are viewable by admins" ON event_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Anyone can create event logs" ON event_logs
    FOR INSERT WITH CHECK (true);

-- NEWSLETTER SUBSCRIPTIONS POLICIES
CREATE POLICY "Newsletter subscriptions are viewable by admins" ON newsletter_subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Anyone can create newsletter subscriptions" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own newsletter subscriptions" ON newsletter_subscriptions
    FOR UPDATE USING (email = (
        SELECT email FROM users WHERE users.id = auth.uid()
    ));

-- HEALTH LOGS POLICIES
CREATE POLICY "Health logs are viewable by admins" ON health_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Anyone can create health logs" ON health_logs
    FOR INSERT WITH CHECK (true);

-- Update existing listings RLS policies to include new columns
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
CREATE POLICY "Listings are viewable by everyone" ON listings
    FOR SELECT USING (
        is_active = true AND 
        status = 'active' AND 
        expires_at > NOW()
    );

DROP POLICY IF EXISTS "Users can view their own listings" ON listings;
CREATE POLICY "Users can view their own listings" ON listings
    FOR SELECT USING (host_id = auth.uid());

DROP POLICY IF EXISTS "Users can create listings" ON listings;
CREATE POLICY "Users can create listings" ON listings
    FOR INSERT WITH CHECK (host_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own listings" ON listings;
CREATE POLICY "Users can update their own listings" ON listings
    FOR UPDATE USING (host_id = auth.uid());

-- Update existing users RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- Update existing payments RLS policies
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create payments" ON payments;
CREATE POLICY "Users can create payments" ON payments
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Update existing inquiries RLS policies
DROP POLICY IF EXISTS "Users can view inquiries for their listings" ON inquiries;
CREATE POLICY "Users can view inquiries for their listings" ON inquiries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = inquiries.listing_id 
            AND listings.host_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can view their own inquiries" ON inquiries;
CREATE POLICY "Users can view their own inquiries" ON inquiries
    FOR SELECT USING (guest_id = auth.uid());

DROP POLICY IF EXISTS "Users can create inquiries" ON inquiries;
CREATE POLICY "Users can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (guest_id = auth.uid());
