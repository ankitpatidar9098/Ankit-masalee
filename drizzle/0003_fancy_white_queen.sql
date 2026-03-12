CREATE TABLE `inventoryTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`transactionType` enum('order','restock','adjustment','return') NOT NULL,
	`quantity` int NOT NULL,
	`previousStock` int NOT NULL,
	`newStock` int NOT NULL,
	`reference` varchar(100),
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventoryTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lowStockAlerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`thresholdQuantity` int NOT NULL DEFAULT 10,
	`isActive` int NOT NULL DEFAULT 1,
	`lastAlertSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lowStockAlerts_id` PRIMARY KEY(`id`),
	CONSTRAINT `lowStockAlerts_productId_unique` UNIQUE(`productId`)
);
--> statement-breakpoint
CREATE TABLE `stockAlertNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`currentStock` int NOT NULL,
	`thresholdQuantity` int NOT NULL,
	`status` enum('pending','sent','acknowledged') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`acknowledgedAt` timestamp,
	`acknowledgedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stockAlertNotifications_id` PRIMARY KEY(`id`)
);
