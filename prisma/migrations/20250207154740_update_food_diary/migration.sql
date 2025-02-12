-- CreateTable
CREATE TABLE `FoodDiary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `date` VARCHAR(10) NOT NULL,
    `mealType` VARCHAR(191) NOT NULL,
    `foodId` INTEGER NOT NULL,
    `quantity` DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
    `calories` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `protein` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `carbs` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `fat` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,

    UNIQUE INDEX `FoodDiary_userId_date_mealType_foodId_key`(`userId`, `date`, `mealType`, `foodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FoodDiary` ADD CONSTRAINT `FoodDiary_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodDiary` ADD CONSTRAINT `FoodDiary_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `foods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
