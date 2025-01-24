/*
  Warnings:

  - You are about to drop the column `activityLevel` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `activityLevel`,
    ADD COLUMN `activity_level` ENUM('sedentary', 'light', 'moderate', 'active', 'veryActive') NULL;
