/*
  Warnings:

  - The values [gain_muscle,improve_health] on the enum `users_diet_goal` will be removed. If these variants are still used in the database, this will fail.
  - The values [lightly_active,moderately_active,very_active] on the enum `users_activity_level` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `diet_goal` ENUM('lose_weight', 'maintain_weight', 'gain_weight') NULL DEFAULT 'maintain_weight',
    MODIFY `activity_level` ENUM('sedentary', 'light', 'moderate', 'active', 'veryActive') NULL DEFAULT 'sedentary';
