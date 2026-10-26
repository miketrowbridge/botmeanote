CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`payload` text NOT NULL,
	`payload_hash` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `notes_created_at_idx` ON `notes` (`created_at`);