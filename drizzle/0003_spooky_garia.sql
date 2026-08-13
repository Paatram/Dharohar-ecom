ALTER TABLE `products` ADD `exact_image_urls_json` text;--> statement-breakpoint
ALTER TABLE `products` ADD `composition_text` text;--> statement-breakpoint
ALTER TABLE `products` ADD `dimensions_text` text;--> statement-breakpoint
ALTER TABLE `products` ADD `care_text` text;--> statement-breakpoint
ALTER TABLE `products` ADD `compatibility_text` text;--> statement-breakpoint
ALTER TABLE `products` ADD `return_policy_text` text;--> statement-breakpoint
ALTER TABLE `products` ADD `dispatch_sla_text` text;
--> statement-breakpoint
PRAGMA optimize;
