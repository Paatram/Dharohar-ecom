ALTER TABLE `orders` ADD `shipping_json` text NOT NULL;
--> statement-breakpoint
PRAGMA optimize;
