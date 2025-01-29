/*
  Warnings:

  - The values [gain_weight] on the enum `users_diet_goal` will be removed. If these variants are still used in the database, this will fail.
  - The values [light,moderate,active,veryActive] on the enum `users_activity_level` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `diet_goal` ENUM('maintain_weight', 'lose_weight', 'gain_muscle', 'improve_health') NULL DEFAULT 'maintain_weight',
    MODIFY `activity_level` ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active') NULL DEFAULT 'sedentary';
