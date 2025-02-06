/*
  Warnings:

  - The values [very_active] on the enum `users_activity_level` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `activity_level` ENUM('sedentary', 'light', 'moderate', 'active', 'very active') NULL;

-- AddForeignKey
ALTER TABLE `diet_goals` ADD CONSTRAINT `diet_goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;