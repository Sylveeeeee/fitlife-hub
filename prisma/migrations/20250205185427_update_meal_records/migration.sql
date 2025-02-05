/*
  Warnings:

  - Made the column `meal_type` on table `meal_records` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_calories` on table `meal_records` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `meal_records` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `meal_records` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_carbs` on table `meal_records` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_fat` on table `meal_records` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_protein` on table `meal_records` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `meal_records` MODIFY `meal_type` ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    MODIFY `total_calories` FLOAT NOT NULL DEFAULT 0,
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL,
    MODIFY `total_carbs` FLOAT NOT NULL DEFAULT 0,
    MODIFY `total_fat` FLOAT NOT NULL DEFAULT 0,
    MODIFY `total_protein` FLOAT NOT NULL DEFAULT 0;
