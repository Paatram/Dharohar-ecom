ALTER TABLE `products` ADD `hsn_code` text;--> statement-breakpoint
ALTER TABLE `products` ADD `gst_basis_points` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `price_includes_tax` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `packed_weight_grams` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `package_length_mm` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `package_width_mm` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `package_height_mm` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `return_window_days` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `dispatch_min_days` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `dispatch_max_days` integer;
--> statement-breakpoint
PRAGMA optimize;
