/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `diet_goals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `diet_goals_user_id_key` ON `diet_goals`(`user_id`);
