/*
  Warnings:

  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.
  - The values [lose_weight,gain_weight] on the enum `users_diet_goal` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `activity_level` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `gender`,
    ADD COLUMN `birthday` DATE NULL,
    ADD COLUMN `sex` ENUM('male', 'female', 'other') NULL,
    MODIFY `diet_goal` ENUM('weight_loss', 'muscle_gain', 'maintain_weight') NULL DEFAULT 'maintain_weight',
    ALTER COLUMN `roleId` DROP DEFAULT,
    MODIFY `activity_level` ENUM('sedentary', 'light', 'moderate', 'active', 'very active') NULL;
