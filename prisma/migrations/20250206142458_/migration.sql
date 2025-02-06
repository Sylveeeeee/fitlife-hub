/*
  Warnings:

  - The values [weight_loss,muscle_gain] on the enum `users_diet_goal` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `diet_goal` ENUM('lose_weight', 'gain_weight', 'maintain_weight') NULL DEFAULT 'maintain_weight';
