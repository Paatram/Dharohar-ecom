CREATE TABLE `addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`label` text DEFAULT 'Home' NOT NULL,
	`recipient_name` text NOT NULL,
	`phone` text NOT NULL,
	`line1` text NOT NULL,
	`line2` text,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`pincode` text NOT NULL,
	`gstin` text,
	`is_default` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_addresses_customer_id` ON `addresses` (`customer_id`);--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text,
	`session_id` text,
	`event_name` text NOT NULL,
	`page_path` text,
	`properties_json` text,
	`consented` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_analytics_events_name_created` ON `analytics_events` (`event_name`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_analytics_events_customer_created` ON `analytics_events` (`customer_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`subject_type` text NOT NULL,
	`subject_id` text NOT NULL,
	`metadata_json` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_events_subject_created` ON `audit_events` (`subject_type`,`subject_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `care_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text,
	`email` text NOT NULL,
	`plan` text NOT NULL,
	`status` text DEFAULT 'interest_registered' NOT NULL,
	`reminder_consent` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_care_subscriptions_customer` ON `care_subscriptions` (`customer_id`);--> statement-breakpoint
CREATE INDEX `idx_care_subscriptions_status` ON `care_subscriptions` (`status`);--> statement-breakpoint
CREATE TABLE `cart_items` (
	`cart_id` text NOT NULL,
	`product_slug` text NOT NULL,
	`quantity` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`cart_id`, `product_slug`),
	FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_slug`) REFERENCES `products`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `carts` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text,
	`email` text,
	`status` text DEFAULT 'open' NOT NULL,
	`currency` text DEFAULT 'INR' NOT NULL,
	`gift_wrap` integer DEFAULT false NOT NULL,
	`gift_message` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_carts_customer_status` ON `carts` (`customer_id`,`status`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`auth_user_id` text NOT NULL,
	`email` text NOT NULL,
	`full_name` text,
	`phone` text,
	`marketing_consent` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_customers_auth_user_id` ON `customers` (`auth_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_customers_email` ON `customers` (`email`);--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`kind` text NOT NULL,
	`customer_id` text,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`subject` text NOT NULL,
	`payload_json` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`consent_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_enquiries_reference` ON `enquiries` (`reference`);--> statement-breakpoint
CREATE INDEX `idx_enquiries_status_created` ON `enquiries` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `idempotency_keys` (
	`key` text PRIMARY KEY NOT NULL,
	`scope` text NOT NULL,
	`request_hash` text NOT NULL,
	`response_status` integer,
	`response_json` text,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_idempotency_keys_expires_at` ON `idempotency_keys` (`expires_at`);--> statement-breakpoint
CREATE TABLE `inventory_movements` (
	`id` text PRIMARY KEY NOT NULL,
	`product_slug` text NOT NULL,
	`order_id` text,
	`movement_type` text NOT NULL,
	`quantity` integer NOT NULL,
	`reason` text NOT NULL,
	`actor_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`product_slug`) REFERENCES `products`(`slug`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_inventory_movements_product_created` ON `inventory_movements` (`product_slug`,`created_at`);--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`invoice_number` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`document_key` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_invoices_invoice_number` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_invoices_order_id` ON `invoices` (`order_id`);--> statement-breakpoint
CREATE TABLE `notification_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text,
	`channel` text NOT NULL,
	`template` text NOT NULL,
	`destination` text NOT NULL,
	`payload_json` text NOT NULL,
	`status` text DEFAULT 'blocked_unconfigured' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`next_attempt_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_notification_outbox_status_next` ON `notification_outbox` (`status`,`next_attempt_at`);--> statement-breakpoint
CREATE TABLE `order_events` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`event_type` text NOT NULL,
	`public_message` text,
	`metadata_json` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_order_events_order_created` ON `order_events` (`order_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_slug` text NOT NULL,
	`product_name` text NOT NULL,
	`unit_price_paise` integer NOT NULL,
	`tax_paise` integer NOT NULL,
	`quantity` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_slug`) REFERENCES `products`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_order_items_order_id` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `idx_order_items_product_slug` ON `order_items` (`product_slug`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` text NOT NULL,
	`customer_id` text,
	`email` text NOT NULL,
	`status` text DEFAULT 'pending_payment' NOT NULL,
	`payment_status` text DEFAULT 'not_started' NOT NULL,
	`fulfillment_status` text DEFAULT 'not_fulfilled' NOT NULL,
	`currency` text DEFAULT 'INR' NOT NULL,
	`subtotal_paise` integer NOT NULL,
	`discount_paise` integer DEFAULT 0 NOT NULL,
	`tax_paise` integer NOT NULL,
	`shipping_paise` integer NOT NULL,
	`total_paise` integer NOT NULL,
	`address_json` text NOT NULL,
	`gift_json` text,
	`idempotency_key` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_orders_order_number` ON `orders` (`order_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_orders_idempotency_key` ON `orders` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `idx_orders_customer_created` ON `orders` (`customer_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_orders_status_created` ON `orders` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_order_id` text,
	`provider_payment_id` text,
	`status` text NOT NULL,
	`amount_paise` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_payments_provider_order` ON `payments` (`provider`,`provider_order_id`);--> statement-breakpoint
CREATE INDEX `idx_payments_order_id` ON `payments` (`order_id`);--> statement-breakpoint
CREATE TABLE `products` (
	`slug` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`material` text NOT NULL,
	`finish` text NOT NULL,
	`currency` text DEFAULT 'INR' NOT NULL,
	`indicative_price_paise` integer NOT NULL,
	`inventory_on_hand` integer DEFAULT 0 NOT NULL,
	`inventory_reserved` integer DEFAULT 0 NOT NULL,
	`exact_images_verified` integer DEFAULT false NOT NULL,
	`composition_verified` integer DEFAULT false NOT NULL,
	`dimensions_verified` integer DEFAULT false NOT NULL,
	`packed_weight_verified` integer DEFAULT false NOT NULL,
	`tax_verified` integer DEFAULT false NOT NULL,
	`care_verified` integer DEFAULT false NOT NULL,
	`compatibility_verified` integer DEFAULT false NOT NULL,
	`return_policy_verified` integer DEFAULT false NOT NULL,
	`dispatch_sla_verified` integer DEFAULT false NOT NULL,
	`commerce_status` text DEFAULT 'verification_required' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_products_category_status` ON `products` (`category`,`commerce_status`);--> statement-breakpoint
CREATE TABLE `returns` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`customer_id` text,
	`reason` text NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`resolution` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_returns_order_id` ON `returns` (`order_id`);--> statement-breakpoint
CREATE INDEX `idx_returns_status` ON `returns` (`status`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`order_item_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`product_slug` text NOT NULL,
	`rating` integer NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'pending_moderation' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_slug`) REFERENCES `products`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_reviews_order_item` ON `reviews` (`order_item_id`);--> statement-breakpoint
CREATE INDEX `idx_reviews_product_status` ON `reviews` (`product_slug`,`status`);--> statement-breakpoint
CREATE TABLE `saved_products` (
	`customer_id` text NOT NULL,
	`product_slug` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`customer_id`, `product_slug`),
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_slug`) REFERENCES `products`(`slug`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_saved_products_customer_created` ON `saved_products` (`customer_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_order_id` text,
	`provider_shipment_id` text,
	`awb` text,
	`courier` text,
	`status` text NOT NULL,
	`tracking_url` text,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_shipments_order_id` ON `shipments` (`order_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_shipments_awb` ON `shipments` (`awb`);--> statement-breakpoint
CREATE TABLE `webhook_events` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`provider_event_id` text NOT NULL,
	`event_type` text NOT NULL,
	`payload_hash` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`processed_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_webhook_events_provider_event` ON `webhook_events` (`provider`,`provider_event_id`);
--> statement-breakpoint
PRAGMA optimize;
