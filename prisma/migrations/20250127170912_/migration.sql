/*
  Warnings:

  - You are about to alter the column `diet_goal` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `diet_goal` ENUM('lose_weight', 'maintain_weight', 'gain_weight') NULL DEFAULT 'maintain_weight';
