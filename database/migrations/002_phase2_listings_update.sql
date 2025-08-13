-- Update existing listings table with Phase 2 features

-- Add new columns to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS premium_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '1 year');
ALTER TABLE listings ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'expired'));
ALTER TABLE listings ADD COLUMN IF NOT EXISTS last_minute_active BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS last_minute_discount_percent INTEGER CHECK (last_minute_discount_percent >= 0 AND last_minute_discount_percent <= 100);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS last_minute_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS geo_lat DECIMAL(10, 8);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS geo_lng DECIMAL(11, 8);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS special_pricing JSONB;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS seasonal_pricing JSONB;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS minimum_stay INTEGER DEFAULT 1;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS instant_book BOOLEAN DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS cancellation_policy VARCHAR(50) DEFAULT 'flexible';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS house_rules TEXT[];
ALTER TABLE listings ADD COLUMN IF NOT EXISTS check_in_time TIME DEFAULT '15:00';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS check_out_time TIME DEFAULT '11:00';

-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verification_code VARCHAR(6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verification_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS language_preference VARCHAR(10) DEFAULT 'bs';
ALTER TABLE users ADD COLUMN IF NOT EXISTS dark_mode BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- Add new columns to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) CHECK (plan_type IN ('monthly', 'quarterly', 'biannual', 'yearly'));
ALTER TABLE payments ADD COLUMN IF NOT EXISTS concierge_service BOOLEAN DEFAULT false;

-- Add new columns to inquiries table
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50);
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2);
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS special_requests TEXT;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_listings_premium_until ON listings(premium_until) WHERE premium_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_expires_at ON listings(expires_at);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_last_minute ON listings(last_minute_active, last_minute_until) WHERE last_minute_active = true;
CREATE INDEX IF NOT EXISTS idx_listings_geo ON listings(geo_lat, geo_lng) WHERE geo_lat IS NOT NULL AND geo_lng IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(country, city);
CREATE INDEX IF NOT EXISTS idx_users_phone_verified ON users(phone_verified) WHERE phone_verified = true;
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified) WHERE email_verified = true;
CREATE INDEX IF NOT EXISTS idx_payments_coupon ON payments(coupon_id) WHERE coupon_id IS NOT NULL;

-- Create function to update listings count in destinations
CREATE OR REPLACE FUNCTION update_destination_listings_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE destinations 
        SET listings_count = listings_count + 1 
        WHERE country_code = NEW.country;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE destinations 
        SET listings_count = listings_count - 1 
        WHERE country_code = OLD.country;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating destination listings count
DROP TRIGGER IF EXISTS trigger_update_destination_listings_count ON listings;
CREATE TRIGGER trigger_update_destination_listings_count
    AFTER INSERT OR DELETE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_destination_listings_count();

-- Create function to auto-expire featured listings
CREATE OR REPLACE FUNCTION auto_expire_featured_listings()
RETURNS void AS $$
BEGIN
    UPDATE listings 
    SET is_featured = false, premium_until = NULL
    WHERE is_featured = true 
    AND premium_until IS NOT NULL 
    AND premium_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-deactivate expired listings
CREATE OR REPLACE FUNCTION auto_deactivate_expired_listings()
RETURNS void AS $$
BEGIN
    UPDATE listings 
    SET status = 'expired', is_active = false
    WHERE status = 'active' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to check last minute deals
CREATE OR REPLACE FUNCTION check_last_minute_deals()
RETURNS void AS $$
BEGIN
    UPDATE listings 
    SET last_minute_active = false
    WHERE last_minute_active = true 
    AND last_minute_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to anonymize deleted user data
CREATE OR REPLACE FUNCTION anonymize_deleted_user()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        -- Anonymize user data
        NEW.email = 'deleted_' || NEW.id || '@deleted.com';
        NEW.full_name = 'Deleted User';
        NEW.phone = NULL;
        NEW.avatar_url = NULL;
        
        -- Log the deletion
        INSERT INTO account_deletion_logs (user_id, reason, data_exported)
        VALUES (NEW.id, 'User requested deletion', false);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user anonymization
DROP TRIGGER IF EXISTS trigger_anonymize_deleted_user ON users;
CREATE TRIGGER trigger_anonymize_deleted_user
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION anonymize_deleted_user();

-- Create function to track listing views
CREATE OR REPLACE FUNCTION track_listing_view()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert view record
    INSERT INTO listing_views (listing_id, viewer_id, ip_address, user_agent)
    VALUES (NEW.listing_id, NEW.viewer_id, NEW.ip_address, NEW.user_agent);
    
    -- Update daily stats
    INSERT INTO listing_stats (listing_id, views, date)
    VALUES (NEW.listing_id, 1, CURRENT_DATE)
    ON CONFLICT (listing_id, date)
    DO UPDATE SET views = listing_stats.views + 1;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tracking views
DROP TRIGGER IF EXISTS trigger_track_listing_view ON listing_views;
CREATE TRIGGER trigger_track_listing_view
    AFTER INSERT ON listing_views
    FOR EACH ROW
    EXECUTE FUNCTION track_listing_view();
