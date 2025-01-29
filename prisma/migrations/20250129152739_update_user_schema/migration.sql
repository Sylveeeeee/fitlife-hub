-- AlterTable
ALTER TABLE `users` MODIFY `roleId` BIGINT NOT NULL DEFAULT 1,
    MODIFY `activity_level` ENUM('sedentary', 'light', 'moderate', 'active', 'veryActive') NULL DEFAULT 'sedentary';
