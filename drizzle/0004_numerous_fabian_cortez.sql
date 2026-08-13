ALTER TABLE `orders` ADD `shipping_json` text DEFAULT '{}' NOT NULL;
--> statement-breakpoint
PRAGMA optimize;
