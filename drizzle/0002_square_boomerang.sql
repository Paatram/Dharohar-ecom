CREATE TABLE `inventory_reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_slug` text NOT NULL,
	`quantity` integer NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_slug`) REFERENCES `products`(`slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_inventory_reservations_order_product` ON `inventory_reservations` (`order_id`,`product_slug`);--> statement-breakpoint
CREATE INDEX `idx_inventory_reservations_status_expiry` ON `inventory_reservations` (`status`,`expires_at`);
--> statement-breakpoint
CREATE TRIGGER `inventory_reservations_validate_insert`
BEFORE INSERT ON `inventory_reservations`
WHEN NEW.status = 'active'
BEGIN
  SELECT CASE WHEN NEW.quantity <= 0 THEN RAISE(ABORT, 'invalid_reservation_quantity') END;
  SELECT CASE WHEN COALESCE((SELECT inventory_on_hand - inventory_reserved FROM products WHERE slug = NEW.product_slug), -1) < NEW.quantity THEN RAISE(ABORT, 'insufficient_inventory') END;
END;
--> statement-breakpoint
CREATE TRIGGER `inventory_reservations_apply_insert`
AFTER INSERT ON `inventory_reservations`
WHEN NEW.status = 'active'
BEGIN
  UPDATE products SET inventory_reserved = inventory_reserved + NEW.quantity, updated_at = NEW.updated_at WHERE slug = NEW.product_slug;
END;
--> statement-breakpoint
CREATE TRIGGER `inventory_reservations_release`
AFTER UPDATE OF status ON `inventory_reservations`
WHEN OLD.status = 'active' AND NEW.status IN ('released', 'expired')
BEGIN
  UPDATE products SET inventory_reserved = MAX(0, inventory_reserved - NEW.quantity), updated_at = NEW.updated_at WHERE slug = NEW.product_slug;
END;
--> statement-breakpoint
CREATE TRIGGER `inventory_reservations_convert`
AFTER UPDATE OF status ON `inventory_reservations`
WHEN OLD.status = 'active' AND NEW.status = 'converted'
BEGIN
  UPDATE products SET inventory_reserved = MAX(0, inventory_reserved - NEW.quantity), inventory_on_hand = inventory_on_hand - NEW.quantity, updated_at = NEW.updated_at WHERE slug = NEW.product_slug;
END;
--> statement-breakpoint
CREATE TRIGGER `inventory_reservations_release_delete`
AFTER DELETE ON `inventory_reservations`
WHEN OLD.status = 'active'
BEGIN
  UPDATE products SET inventory_reserved = MAX(0, inventory_reserved - OLD.quantity), updated_at = CAST(strftime('%s','now') AS INTEGER) * 1000 WHERE slug = OLD.product_slug;
END;
--> statement-breakpoint
PRAGMA optimize;
