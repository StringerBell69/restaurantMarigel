-- Restaurant SABORES DE PORTUGAL - Seed Data for Testing
-- Run this after setting up the main schema

-- ============================================================================
-- MENU ITEMS
-- ============================================================================

INSERT INTO menu_items (name, description, price, category, dietary_tags, allergens, is_active, sort_order) VALUES
-- Starters
('Foie Gras Terrine', 'Duck foie gras with fig compote and brioche toast', 24.00, 'Starter', ARRAY['Gluten-Free Option'], ARRAY['Dairy'], true, 1),
('Lobster Bisque', 'Rich shellfish soup with cognac cream', 18.00, 'Starter', NULL, ARRAY['Shellfish', 'Dairy'], true, 2),
('Burrata & Heirloom Tomatoes', 'Fresh burrata with seasonal tomatoes, basil, aged balsamic', 16.00, 'Starter', ARRAY['Vegetarian', 'Gluten-Free'], ARRAY['Dairy'], true, 3),
('Beef Tartare', 'Hand-cut beef tenderloin, quail egg, truffle aioli', 22.00, 'Starter', NULL, ARRAY['Eggs'], true, 4),
('Seared Scallops', 'Diver scallops, cauliflower purée, crispy pancetta', 26.00, 'Starter', ARRAY['Gluten-Free'], ARRAY['Shellfish'], true, 5),

-- Main Courses
('Wagyu Beef Tenderloin', '8oz Japanese wagyu, potato gratin, red wine reduction', 78.00, 'Main', NULL, ARRAY['Dairy'], true, 10),
('Pan-Seared Sea Bass', 'Mediterranean sea bass, fennel, citrus beurre blanc', 48.00, 'Main', ARRAY['Gluten-Free'], ARRAY['Fish', 'Dairy'], true, 11),
('Duck Breast Confit', 'Roasted duck, cherry gastrique, root vegetables', 52.00, 'Main', ARRAY['Gluten-Free'], NULL, true, 12),
('Lobster Risotto', 'Arborio rice, Maine lobster, saffron, parmesan', 62.00, 'Main', ARRAY['Gluten-Free'], ARRAY['Shellfish', 'Dairy'], true, 13),
('Wild Mushroom Ravioli', 'Handmade pasta, porcini cream, truffle oil', 38.00, 'Main', ARRAY['Vegetarian'], ARRAY['Gluten', 'Eggs', 'Dairy'], true, 14),
('Lamb Rack', 'Herb-crusted lamb, mint chimichurri, seasonal vegetables', 58.00, 'Main', NULL, NULL, true, 15),

-- Desserts
('Chocolate Soufflé', 'Dark chocolate soufflé, vanilla ice cream', 14.00, 'Dessert', ARRAY['Vegetarian'], ARRAY['Eggs', 'Dairy', 'Gluten'], true, 20),
('Crème Brûlée', 'Vanilla bean custard, caramelized sugar', 12.00, 'Dessert', ARRAY['Vegetarian', 'Gluten-Free'], ARRAY['Dairy', 'Eggs'], true, 21),
('Tiramisu', 'Classic Italian dessert, espresso, mascarpone', 13.00, 'Dessert', ARRAY['Vegetarian'], ARRAY['Dairy', 'Eggs', 'Gluten'], true, 22),
('Lemon Tart', 'Meyer lemon curd, Italian meringue, berries', 12.00, 'Dessert', ARRAY['Vegetarian'], ARRAY['Dairy', 'Eggs', 'Gluten'], true, 23),
('Cheese Selection', 'Artisanal cheese board, honeycomb, crackers', 18.00, 'Dessert', ARRAY['Vegetarian'], ARRAY['Dairy', 'Gluten'], true, 24),

-- Drinks
('House Wine by Glass', 'Selection of red, white, and rosé', 12.00, 'Drink', NULL, NULL, true, 30),
('Premium Wine by Bottle', 'Curated selection from our cellar', 65.00, 'Drink', NULL, NULL, true, 31),
('Craft Cocktails', 'Classic and signature cocktails', 16.00, 'Drink', NULL, NULL, true, 32),
('Champagne', 'Dom Pérignon, Moët, Veuve Clicquot', 35.00, 'Drink', NULL, NULL, true, 33),
('Artisan Coffee', 'Espresso, cappuccino, latte', 5.00, 'Drink', ARRAY['Vegan Option'], ARRAY['Dairy'], true, 34),

-- Specials
('Chef''s Tasting Menu', '7-course seasonal tasting menu with wine pairing', 150.00, 'Special', NULL, ARRAY['Varies'], true, 40),
('Surf & Turf', 'Wagyu filet and lobster tail combination', 95.00, 'Special', NULL, ARRAY['Shellfish'], true, 41);

-- ============================================================================
-- RESTAURANT TABLES
-- ============================================================================

INSERT INTO restaurant_tables (table_number, floor_level, capacity_min, capacity_max, table_type, features, position_x, position_y, width, height, is_active) VALUES
-- Main Dining Room (Floor 1)
('T1', 1, 2, 2, 'Window', ARRAY['Window View', 'Romantic'], 50, 50, 80, 80, true),
('T2', 1, 2, 2, 'Window', ARRAY['Window View'], 150, 50, 80, 80, true),
('T3', 1, 4, 4, 'Standard', ARRAY['Family Friendly'], 50, 150, 100, 100, true),
('T4', 1, 4, 4, 'Standard', ARRAY['Family Friendly'], 170, 150, 100, 100, true),
('T5', 1, 2, 4, 'Standard', ARRAY['Flexible'], 50, 270, 100, 80, true),
('T6', 1, 2, 4, 'Standard', ARRAY['Flexible'], 170, 270, 100, 80, true),
('T7', 1, 6, 6, 'Standard', ARRAY['Large Party'], 300, 50, 140, 140, true),
('T8', 1, 6, 8, 'Standard', ARRAY['Large Party', 'Can Combine'], 300, 210, 140, 140, true),

-- Outdoor Terrace (Floor 1)
('T9', 1, 2, 2, 'Outdoor', ARRAY['Outdoor', 'Seasonal'], 500, 50, 80, 80, true),
('T10', 1, 2, 2, 'Outdoor', ARRAY['Outdoor', 'Seasonal'], 600, 50, 80, 80, true),
('T11', 1, 4, 4, 'Outdoor', ARRAY['Outdoor', 'Seasonal'], 500, 150, 100, 100, true),
('T12', 1, 4, 4, 'Outdoor', ARRAY['Outdoor', 'Seasonal'], 620, 150, 100, 100, true),

-- Private Dining Room (Floor 2)
('P1', 2, 8, 12, 'Private', ARRAY['Private Room', 'Events', 'Projector'], 100, 100, 200, 200, true),

-- Bar Area (Floor 1)
('B1', 1, 2, 2, 'Bar', ARRAY['Bar Seating', 'Quick Service'], 700, 300, 60, 60, true),
('B2', 1, 2, 2, 'Bar', ARRAY['Bar Seating', 'Quick Service'], 780, 300, 60, 60, true);

-- Set table combinations
UPDATE restaurant_tables SET can_combine_with = ARRAY['T8'::text] WHERE table_number = 'T7';
UPDATE restaurant_tables SET can_combine_with = ARRAY['T7'::text] WHERE table_number = 'T8';
UPDATE restaurant_tables SET can_combine_with = ARRAY['T6'::text] WHERE table_number = 'T5';
UPDATE restaurant_tables SET can_combine_with = ARRAY['T5'::text] WHERE table_number = 'T6';

-- ============================================================================
-- SAMPLE CUSTOMERS
-- ============================================================================

INSERT INTO customers (first_name, last_name, email, phone, email_verified, phone_verified, customer_tags, total_visits, dietary_restrictions) VALUES
('John', 'Smith', 'john.smith@example.com', '+14155551234', true, true, ARRAY['Regular'], 12, ARRAY['Gluten-Free']),
('Emma', 'Johnson', 'emma.j@example.com', '+14155555678', true, false, ARRAY['VIP'], 25, NULL),
('Michael', 'Brown', 'michael.b@example.com', NULL, true, false, ARRAY['First-time'], 1, ARRAY['Vegetarian']),
('Sarah', 'Davis', NULL, '+14155559999', false, true, ARRAY['Regular'], 8, ARRAY['Dairy-Free']),
('James', 'Wilson', 'james.w@example.com', '+14155553333', true, true, ARRAY['VIP', 'Regular'], 45, NULL);

-- ============================================================================
-- SAMPLE RESERVATIONS
-- ============================================================================

-- Today's reservations
INSERT INTO reservations (reservation_number, customer_id, reservation_date, reservation_time, duration_minutes, guests_count, assigned_tables, status, source, is_verified, verification_method) VALUES
('RES-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-001', (SELECT id FROM customers WHERE email = 'john.smith@example.com'), CURRENT_DATE, '19:00', 120, 2, ARRAY[(SELECT id FROM restaurant_tables WHERE table_number = 'T1')], 'confirmed', 'web', true, 'email'),
('RES-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-002', (SELECT id FROM customers WHERE email = 'emma.j@example.com'), CURRENT_DATE, '19:30', 120, 4, ARRAY[(SELECT id FROM restaurant_tables WHERE table_number = 'T3')], 'confirmed', 'phone', true, 'phone'),
('RES-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-003', (SELECT id FROM customers WHERE email = 'james.w@example.com'), CURRENT_DATE, '20:00', 180, 8, ARRAY[(SELECT id FROM restaurant_tables WHERE table_number = 'T7'), (SELECT id FROM restaurant_tables WHERE table_number = 'T8')], 'confirmed', 'web', true, 'both');

-- Tomorrow's reservations
INSERT INTO reservations (reservation_number, customer_id, reservation_date, reservation_time, duration_minutes, guests_count, assigned_tables, status, source, is_verified, verification_method, occasion, special_requests) VALUES
('RES-' || TO_CHAR(CURRENT_DATE + INTERVAL '1 day', 'YYYYMMDD') || '-001', (SELECT id FROM customers WHERE phone = '+14155559999'), CURRENT_DATE + INTERVAL '1 day', '18:30', 120, 2, ARRAY[(SELECT id FROM restaurant_tables WHERE table_number = 'T1')], 'confirmed', 'web', true, 'phone', 'Anniversary', 'Please arrange flowers on the table'),
('RES-' || TO_CHAR(CURRENT_DATE + INTERVAL '1 day', 'YYYYMMDD') || '-002', (SELECT id FROM customers WHERE email = 'michael.b@example.com'), CURRENT_DATE + INTERVAL '1 day', '19:00', 4, ARRAY[(SELECT id FROM restaurant_tables WHERE table_number = 'T4')], 'pending', 'web', true, 'email', NULL, 'Vegetarian options please');

-- ============================================================================
-- FLOOR PLAN
-- ============================================================================

INSERT INTO floor_plans (name, floor_count, is_active) VALUES
('Main Dining Layout', 2, true);

-- ============================================================================
-- MESSAGE TEMPLATES (Additional)
-- ============================================================================

INSERT INTO message_templates (name, template_type, channel, language, subject, content, is_active) VALUES
('Thank You Email', 'thank_you', 'email', 'en', 'Thank you for dining with us!', 'Dear {name},\n\nThank you for choosing {restaurant_name}! We hope you enjoyed your dining experience.\n\nWe would love to hear your feedback. Please take a moment to leave us a review.\n\nWe look forward to welcoming you again soon!\n\nBest regards,\nThe SABORES DE PORTUGAL Team', true),
('Cancellation Confirmation', 'cancellation', 'whatsapp', 'en', NULL, 'Hi {name}, your reservation for {date} at {time} has been cancelled. We hope to see you again soon at {restaurant_name}!', true),
('Modification Confirmation', 'modification', 'email', 'en', 'Reservation Updated', 'Hi {name},\n\nYour reservation has been updated:\n\nNew Date: {date}\nNew Time: {time}\nGuests: {guests}\nTable: {table}\n\nConfirmation: {reservation_number}\n\nSee you soon!', true);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE menu_items IS 'Sample menu items for Restaurant SABORES DE PORTUGAL - adjust prices and items as needed';
COMMENT ON TABLE restaurant_tables IS 'Sample table configuration - customize based on your actual floor plan';
COMMENT ON TABLE customers IS 'Test customer data - replace with real customers in production';
COMMENT ON TABLE reservations IS 'Sample reservations for testing - these will be dated from when you run this script';

-- Display summary
SELECT 'Seed data inserted successfully!' as message;
SELECT COUNT(*) as menu_items FROM menu_items;
SELECT COUNT(*) as tables FROM restaurant_tables;
SELECT COUNT(*) as customers FROM customers;
SELECT COUNT(*) as reservations FROM reservations;
SELECT COUNT(*) as templates FROM message_templates;
