/*
  Warnings:

  - You are about to drop the column `activity_level` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `activity_level`,
    ADD COLUMN `activityLevel` ENUM('sedentary', 'light', 'moderate', 'active', 'very active') NULL;
