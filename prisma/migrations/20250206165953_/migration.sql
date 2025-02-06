/*
  Warnings:

  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `foods` MODIFY `category` ENUM('COMMON_FOOD', 'BEVERAGES', 'RESTAURANTS') NULL DEFAULT 'COMMON_FOOD';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `gender`,
    ADD COLUMN `birthday` DATE NULL,
    ADD COLUMN `sex` ENUM('male', 'female') NULL,
    MODIFY `diet_goal` ENUM('lose_weight', 'maintain_weight', 'gain_weight') NULL DEFAULT 'maintain_weight',
    ALTER COLUMN `roleId` DROP DEFAULT,
    ALTER COLUMN `activity_level` DROP DEFAULT;

-- CreateTable
CREATE TABLE `post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Glass` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
