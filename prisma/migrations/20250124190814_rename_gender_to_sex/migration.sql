/*
  Warnings:

  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `gender`,
    ADD COLUMN `sex` ENUM('male', 'female') NULL;
