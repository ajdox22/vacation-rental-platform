-- Phase 2 Seed Data
-- Vacation Rental Platform - Premium Features

-- Insert amenities
INSERT INTO amenities (name, category, icon) VALUES
-- Basic amenities
('Wi-Fi', 'internet', 'wifi'),
('Parking', 'parking', 'car'),
('Klima uređaj', 'climate', 'snowflake'),
('Grejanje', 'climate', 'thermometer'),
('TV', 'entertainment', 'tv'),
('Kuhinja', 'kitchen', 'utensils'),
('Veš mašina', 'laundry', 'washing-machine'),
('Sušilica', 'laundry', 'wind'),

-- Outdoor amenities
('Terasa', 'outdoor', 'sun'),
('Balkon', 'outdoor', 'home'),
('Vrt', 'outdoor', 'tree'),
('BBQ', 'outdoor', 'flame'),
('Bazen', 'outdoor', 'droplets'),
('Parking za bicikle', 'outdoor', 'bike'),

-- Safety & Security
('Sigurnosna vrata', 'safety', 'shield'),
('Video nadzor', 'safety', 'video'),
('Prva pomoć', 'safety', 'heart'),
('Dimni detektor', 'safety', 'alert-circle'),

-- Accessibility
('Bez stepenica', 'accessibility', 'wheelchair'),
('Široka vrata', 'accessibility', 'door-open'),
('Grab bars', 'accessibility', 'grip-horizontal'),

-- Pet friendly
('Dozvoljeni kućni ljubimci', 'pets', 'heart'),
('Dvorište za pse', 'pets', 'home'),

-- Business
('Radni prostor', 'business', 'monitor'),
('Printer', 'business', 'printer'),
('Konferencijska soba', 'business', 'users'),

-- Family
('Dječija stolica', 'family', 'baby'),
('Dječiji krevet', 'family', 'bed'),
('Igraonica', 'family', 'gamepad-2'),

-- Luxury
('Spa', 'luxury', 'sparkles'),
('Fitness centar', 'luxury', 'dumbbell'),
('Konobar', 'luxury', 'user-check'),
('Helipad', 'luxury', 'plane');

-- Insert destinations
INSERT INTO destinations (name, slug, country_code, description, featured_image) VALUES
-- Bosnia and Herzegovina
('Jahorina', 'ba/jahorina', 'ba', 'Najpopularnija planina za skijanje u BiH', '/destinations/jahorina.jpg'),
('Bjelašnica', 'ba/bjelasnica', 'ba', 'Olimpijska planina sa prekrasnim stazama', '/destinations/bjelasnica.jpg'),
('Neum', 'ba/neum', 'ba', 'Jedini bosanskohercegovački grad na moru', '/destinations/neum.jpg'),
('Sarajevo', 'ba/sarajevo', 'ba', 'Glavni grad sa bogatom istorijom', '/destinations/sarajevo.jpg'),
('Mostar', 'ba/mostar', 'ba', 'Grad mostova i UNESCO baštine', '/destinations/mostar.jpg'),
('Banja Luka', 'ba/banja-luka', 'ba', 'Glavni grad Republike Srpske', '/destinations/banja-luka.jpg'),

-- Serbia
('Kopaonik', 'rs/kopaonik', 'rs', 'Najveći ski centar u Srbiji', '/destinations/kopaonik.jpg'),
('Tara', 'rs/tara', 'rs', 'Planina sa prekrasnim Drinom', '/destinations/tara.jpg'),
('Zlatibor', 'rs/zlatibor', 'rs', 'Popularna planina za odmor', '/destinations/zlatibor.jpg'),
('Beograd', 'rs/beograd', 'rs', 'Glavni grad Srbije', '/destinations/beograd.jpg'),
('Novi Sad', 'rs/novi-sad', 'rs', 'Glavni grad Vojvodine', '/destinations/novi-sad.jpg'),
('Niš', 'rs/nis', 'rs', 'Treći najveći grad u Srbiji', '/destinations/nis.jpg'),

-- Croatia
('Dubrovnik', 'hr/dubrovnik', 'hr', 'Grad zidina i UNESCO baštine', '/destinations/dubrovnik.jpg'),
('Split', 'hr/split', 'hr', 'Glavni grad Dalmacije', '/destinations/split.jpg'),
('Zagreb', 'hr/zagreb', 'hr', 'Glavni grad Hrvatske', '/destinations/zagreb.jpg'),
('Rijeka', 'hr/rijeka', 'hr', 'Glavni grad Primorja', '/destinations/rijeka.jpg'),
('Pula', 'hr/pula', 'hr', 'Grad sa rimskom arenom', '/destinations/pula.jpg'),
('Zadar', 'hr/zadar', 'hr', 'Grad sa orguljama morskih valova', '/destinations/zadar.jpg'),

-- Montenegro
('Budva', 'me/budva', 'me', 'Turistička prestonica Crne Gore', '/destinations/budva.jpg'),
('Kotor', 'me/kotor', 'me', 'UNESCO baština u Boki Kotorskoj', '/destinations/kotor.jpg'),
('Podgorica', 'me/podgorica', 'me', 'Glavni grad Crne Gore', '/destinations/podgorica.jpg'),
('Herceg Novi', 'me/herceg-novi', 'me', 'Grad na ulazu u Boku', '/destinations/herceg-novi.jpg'),
('Ulcinj', 'me/ulcinj', 'me', 'Najjužniji grad Crne Gore', '/destinations/ulcinj.jpg'),
('Žabljak', 'me/zabljak', 'me', 'Planinski centar na Durmitoru', '/destinations/zabljak.jpg');

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, value, valid_from, valid_to, usage_limit, owner_host_id) VALUES
-- Global coupons
('WELCOME10', 'percent', 10, NOW(), NOW() + INTERVAL '6 months', 1000, NULL),
('SUMMER20', 'percent', 20, NOW(), NOW() + INTERVAL '3 months', 500, NULL),
('WINTER15', 'percent', 15, NOW() + INTERVAL '4 months', 300, NULL),
('FIRST50', 'fixed', 50, NOW(), NOW() + INTERVAL '1 year', 200, NULL),

-- Host-specific coupons (will be updated with actual host IDs)
('HOSTSPECIAL', 'percent', 25, NOW(), NOW() + INTERVAL '2 months', 50, NULL),
('WEEKEND30', 'percent', 30, NOW(), NOW() + INTERVAL '1 month', 100, NULL);

-- Insert sample partners
INSERT INTO partners (name, description, logo_url, website_url, contact_email, services) VALUES
('CleanPro', 'Profesionalno čišćenje apartmana', '/partners/cleanpro.png', 'https://cleanpro.ba', 'info@cleanpro.ba', ARRAY['cleaning', 'laundry']),
('RentGear', 'Iznajmljivanje opreme za skijanje', '/partners/rentgear.png', 'https://rentgear.ba', 'info@rentgear.ba', ARRAY['ski_rental', 'equipment']),
('FoodDelivery', 'Dostava hrane na kućnu adresu', '/partners/fooddelivery.png', 'https://fooddelivery.ba', 'info@fooddelivery.ba', ARRAY['food_delivery', 'catering']),
('TransportPro', 'Transfer od aerodroma', '/partners/transportpro.png', 'https://transportpro.ba', 'info@transportpro.ba', ARRAY['airport_transfer', 'transport']),
('TourGuide', 'Licencirani turistički vodiči', '/partners/tourguide.png', 'https://tourguide.ba', 'info@tourguide.ba', ARRAY['guided_tours', 'excursions']);

-- Insert sample trust badges
INSERT INTO trust_badges (name, description, icon_url) VALUES
('Verifikovan domaćin', 'Domaćin je verifikovan sa dokumentima', '/badges/verified-host.svg'),
('Siguran plaćanje', 'Sigurno plaćanje kroz platformu', '/badges/secure-payment.svg'),
('24/7 podrška', 'Podrška dostupna 24 sata', '/badges/24-7-support.svg'),
('Besplatna otkazivanje', 'Besplatno otkazivanje do 24h', '/badges/free-cancellation.svg'),
('Čistoća garantovana', 'Profesionalno čišćenje', '/badges/cleanliness-guaranteed.svg'),
('Brza rezervacija', 'Rezervacija u manje od 1 minute', '/badges/instant-booking.svg');

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, author_id, is_published, published_at, seo_title, seo_description, tags) VALUES
('Top 10 planina za skijanje u BiH', 'top-10-planina-skijanje-bih', 'Otkrijte najbolje lokacije za skijanje u Bosni i Hercegovini', 'Detaljan članak o najboljim planinama za skijanje...', '00000000-0000-0000-0000-000000000001', true, NOW(), 'Najbolje planine za skijanje u BiH 2024', 'Otkrijte top 10 planina za skijanje u Bosni i Hercegovini. Savršeni vodič za zimski odmor.', ARRAY['skijanje', 'planine', 'zima', 'biH']),
('Kako izabrati savršen apartman za odmor', 'kako-izabrati-apartman-odmor', 'Savjeti za izbor idealnog smještaja za vaš odmor', 'Praktični savjeti za izbor apartmana...', '00000000-0000-0000-0000-000000000001', true, NOW(), 'Savjeti za izbor apartmana za odmor', 'Naučite kako izabrati savršen apartman za odmor. Praktični savjeti i trikovi.', ARRAY['apartmani', 'odmor', 'savjeti', 'putovanje']),
('Najbolje plaže u Hrvatskoj', 'najbolje-plaze-hrvatska', 'Otkrijte skrivene dragulje Jadranskog mora', 'Vodič kroz najljepše plaže Hrvatske...', '00000000-0000-0000-0000-000000000001', true, NOW(), 'Najljepše plaže Hrvatske 2024', 'Otkrijte najljepše plaže u Hrvatskoj. Skriveni dragulji Jadranskog mora.', ARRAY['plaže', 'Hrvatska', 'more', 'ljeto']),
('Skriveni dragulji Crne Gore', 'skriveni-dragulji-crna-gora', 'Otkrijte nepoznate lokacije u Crnoj Gori', 'Vodič kroz manje poznate lokacije...', '00000000-0000-0000-0000-000000000001', true, NOW(), 'Skriveni dragulji Crne Gore', 'Otkrijte nepoznate lokacije u Crnoj Gori. Vodič za avanturiste.', ARRAY['Crna Gora', 'avantura', 'priroda', 'skriveno']);

-- Update destinations with listings count (this will be updated by triggers)
UPDATE destinations SET listings_count = 0;

-- Insert sample service orders
INSERT INTO service_orders (user_id, listing_id, service_type, status, cost, scheduled_date, notes) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'photography', 'pending', 150, NOW() + INTERVAL '1 week', 'Profesionalno fotografisanje apartmana'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'cleaning', 'confirmed', 80, NOW() + INTERVAL '2 days', 'Čišćenje nakon gostiju'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'maintenance', 'in_progress', 200, NOW() + INTERVAL '3 days', 'Popravka klima uređaja');

-- Insert sample concierge tasks
INSERT INTO concierge_tasks (user_id, task_type, status, description) VALUES
('00000000-0000-0000-0000-000000000001', 'listing_creation', 'pending', 'Kreiranje novog oglasa za apartman u Sarajevu'),
('00000000-0000-0000-0000-000000000001', 'photo_upload', 'in_progress', 'Profesionalno fotografisanje i upload slika'),
('00000000-0000-0000-0000-000000000001', 'description_writing', 'completed', 'Pisanje privlačnog opisa apartmana');

-- Insert sample promotions
INSERT INTO promotions (listing_id, promotion_type, status, start_date, end_date, cost) VALUES
('00000000-0000-0000-0000-000000000001', 'instagram', 'pending', NOW(), NOW() + INTERVAL '1 month', 0),
('00000000-0000-0000-0000-000000000001', 'google', 'active', NOW(), NOW() + INTERVAL '2 months', 20),
('00000000-0000-0000-0000-000000000001', 'facebook', 'completed', NOW() - INTERVAL '1 month', NOW(), 15);

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, data) VALUES
('00000000-0000-0000-0000-000000000001', 'expiry_reminder', 'Oglas ističe uskoro', 'Vaš oglas ističe za 5 dana. Obnovite ga da nastavite sa primanjem rezervacija.', '{"listing_id": "00000000-0000-0000-0000-000000000001", "days_left": 5}'),
('00000000-0000-0000-0000-000000000001', 'new_inquiry', 'Nova poruka od gosta', 'Imate novu poruku od gosta za vaš apartman.', '{"inquiry_id": "00000000-0000-0000-0000-000000000001"}'),
('00000000-0000-0000-0000-000000000001', 'payment_received', 'Plaćanje primljeno', 'Vaše plaćanje je uspješno obrađeno.', '{"payment_id": "00000000-0000-0000-0000-000000000001", "amount": 25}');

-- Insert sample consent logs
INSERT INTO consent_logs (user_id, consent_type, granted, ip_address) VALUES
('00000000-0000-0000-0000-000000000001', 'cookies', true, '192.168.1.1'),
('00000000-0000-0000-0000-000000000001', 'marketing', true, '192.168.1.1'),
('00000000-0000-0000-0000-000000000001', 'analytics', true, '192.168.1.1');

-- Insert sample event logs
INSERT INTO event_logs (user_id, event_type, event_data, ip_address) VALUES
('00000000-0000-0000-0000-000000000001', 'listing_view', '{"listing_id": "00000000-0000-0000-0000-000000000001"}', '192.168.1.1'),
('00000000-0000-0000-0000-000000000001', 'inquiry_sent', '{"listing_id": "00000000-0000-0000-0000-000000000001"}', '192.168.1.1'),
('00000000-0000-0000-0000-000000000001', 'payment_started', '{"plan_type": "monthly", "amount": 25}', '192.168.1.1');

-- Insert sample health logs
INSERT INTO health_logs (service, status, response_time, error_message) VALUES
('database', 'healthy', 15, NULL),
('email', 'healthy', 200, NULL),
('storage', 'healthy', 50, NULL),
('api', 'healthy', 100, NULL);

-- Insert sample newsletter subscriptions
INSERT INTO newsletter_subscriptions (email, is_active) VALUES
('test@example.com', true),
('user@example.com', true),
('newsletter@example.com', true);
