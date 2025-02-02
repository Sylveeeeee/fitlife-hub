-- DropForeignKey
ALTER TABLE `meal_items` DROP FOREIGN KEY `meal_items_ibfk_1`;

-- DropForeignKey
ALTER TABLE `meal_items` DROP FOREIGN KEY `meal_items_ibfk_2`;

-- DropForeignKey
ALTER TABLE `meal_records` DROP FOREIGN KEY `meal_records_ibfk_1`;

-- AlterTable
ALTER TABLE `meal_items` ADD COLUMN `carbs` FLOAT NOT NULL DEFAULT 0,
    ADD COLUMN `fat` FLOAT NOT NULL DEFAULT 0,
    ADD COLUMN `protein` FLOAT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `meal_records` ADD COLUMN `total_carbs` FLOAT NULL DEFAULT 0,
    ADD COLUMN `total_fat` FLOAT NULL DEFAULT 0,
    ADD COLUMN `total_protein` FLOAT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `meal_items` ADD CONSTRAINT `meal_items_meal_record_id_fkey` FOREIGN KEY (`meal_record_id`) REFERENCES `meal_records`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_items` ADD CONSTRAINT `meal_items_food_id_fkey` FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_records` ADD CONSTRAINT `meal_records_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `meal_items_food_id_idx` ON `meal_items`(`food_id`);
DROP INDEX `food_id` ON `meal_items`;

-- RedefineIndex
CREATE INDEX `meal_items_meal_record_id_idx` ON `meal_items`(`meal_record_id`);
DROP INDEX `meal_record_id` ON `meal_items`;

-- RedefineIndex
CREATE INDEX `meal_records_user_id_idx` ON `meal_records`(`user_id`);
DROP INDEX `user_id` ON `meal_records`;
