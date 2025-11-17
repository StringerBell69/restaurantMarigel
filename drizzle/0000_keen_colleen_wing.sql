CREATE TABLE "communication_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reservation_id" uuid,
	"customer_id" uuid,
	"message_type" text NOT NULL,
	"channel" text NOT NULL,
	"recipient" text NOT NULL,
	"subject" text,
	"message_content" text NOT NULL,
	"status" text DEFAULT 'pending',
	"error_message" text,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "message_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"template_type" text NOT NULL,
	"channel" text NOT NULL,
	"language" text DEFAULT 'en',
	"subject" text,
	"content" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customer_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"contact_type" text NOT NULL,
	"contact_value" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"email_verified" boolean DEFAULT false,
	"phone_verified" boolean DEFAULT false,
	"profile_photo_url" text,
	"marketing_consent_email" boolean DEFAULT false,
	"marketing_consent_whatsapp" boolean DEFAULT false,
	"dietary_restrictions" text[],
	"allergens" text[],
	"preferred_table_type" text,
	"customer_tags" text[],
	"total_visits" integer DEFAULT 0,
	"total_spent" numeric(10, 2) DEFAULT '0',
	"no_show_count" integer DEFAULT 0,
	"is_blacklisted" boolean DEFAULT false,
	"blacklist_reason" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "customers_email_unique" UNIQUE("email"),
	CONSTRAINT "customers_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "otp_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_type" text NOT NULL,
	"contact_value" text NOT NULL,
	"otp_code" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"attempts" integer DEFAULT 0,
	"is_used" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "floor_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"background_image_url" text,
	"floor_count" integer DEFAULT 1,
	"is_active" boolean DEFAULT false,
	"layout_data" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "restaurant_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_number" text NOT NULL,
	"floor_level" integer DEFAULT 1,
	"capacity_min" integer NOT NULL,
	"capacity_max" integer NOT NULL,
	"table_type" text,
	"features" text[],
	"position_x" numeric(10, 2),
	"position_y" numeric(10, 2),
	"width" numeric(10, 2),
	"height" numeric(10, 2),
	"rotation" integer DEFAULT 0,
	"can_combine_with" text[],
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "restaurant_tables_table_number_unique" UNIQUE("table_number")
);
--> statement-breakpoint
CREATE TABLE "table_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_id" uuid,
	"start_datetime" timestamp with time zone NOT NULL,
	"end_datetime" timestamp with time zone NOT NULL,
	"reason" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reservation_menu_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reservation_id" uuid,
	"menu_item_id" uuid,
	"quantity" integer NOT NULL,
	"price_at_time" numeric(10, 2) NOT NULL,
	"special_instructions" text,
	"is_prepared" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reservation_number" text NOT NULL,
	"customer_id" uuid,
	"reservation_date" date NOT NULL,
	"reservation_time" time NOT NULL,
	"duration_minutes" integer DEFAULT 120,
	"guests_count" integer NOT NULL,
	"assigned_tables" uuid[],
	"occasion" text,
	"special_requests" text,
	"dietary_notes" text,
	"status" text DEFAULT 'pending',
	"source" text DEFAULT 'web',
	"is_verified" boolean DEFAULT false,
	"verified_at" timestamp with time zone,
	"verification_method" text,
	"requires_deposit" boolean DEFAULT false,
	"deposit_amount" numeric(10, 2),
	"deposit_status" text,
	"deposit_transaction_id" text,
	"confirmation_sent" boolean DEFAULT false,
	"confirmation_sent_at" timestamp with time zone,
	"reminder_sent" boolean DEFAULT false,
	"reminder_sent_at" timestamp with time zone,
	"admin_notes" text,
	"cancellation_reason" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"checked_in_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_by" uuid,
	"modified_by" uuid,
	CONSTRAINT "reservations_reservation_number_unique" UNIQUE("reservation_number")
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"image_url" text NOT NULL,
	"thumbnail_url" text,
	"category" text,
	"is_featured" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"file_size" integer,
	"width" integer,
	"height" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"category" text NOT NULL,
	"dietary_tags" text[],
	"allergens" text[],
	"image_url" text,
	"preparation_time_minutes" integer,
	"availability" text DEFAULT 'always',
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"popularity_score" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'staff',
	"permissions" text,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_user_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid,
	"changes" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "restaurant_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"setting_key" text NOT NULL,
	"setting_value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "restaurant_settings_setting_key_unique" UNIQUE("setting_key")
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"party_size" integer NOT NULL,
	"requested_time" text NOT NULL,
	"estimated_wait_minutes" integer,
	"status" text DEFAULT 'waiting',
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"notified_at" timestamp with time zone,
	"seated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "communication_log" ADD CONSTRAINT "communication_log_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communication_log" ADD CONSTRAINT "communication_log_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_contacts" ADD CONSTRAINT "customer_contacts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "table_blocks" ADD CONSTRAINT "table_blocks_table_id_restaurant_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."restaurant_tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation_menu_items" ADD CONSTRAINT "reservation_menu_items_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist" ADD CONSTRAINT "waitlist_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_communication_log_reservation" ON "communication_log" USING btree ("reservation_id");--> statement-breakpoint
CREATE INDEX "idx_customers_email" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_customers_phone" ON "customers" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "idx_otp_contact" ON "otp_verifications" USING btree ("contact_type","contact_value");--> statement-breakpoint
CREATE INDEX "idx_reservations_date" ON "reservations" USING btree ("reservation_date");--> statement-breakpoint
CREATE INDEX "idx_reservations_status" ON "reservations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_reservations_customer" ON "reservations" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_menu_items_category" ON "menu_items" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_menu_items_active" ON "menu_items" USING btree ("is_active");