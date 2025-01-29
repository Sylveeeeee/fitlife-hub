/*
  Warnings:

  - You are about to drop the column `type_of_food` on the `foods` table. All the data in the column will be lost.
  - You are about to alter the column `category` on the `foods` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `foods` DROP COLUMN `type_of_food`,
    MODIFY `category` ENUM('COMMON_FOOD', 'BEVERAGES', 'RESTAURANTS') NULL;
