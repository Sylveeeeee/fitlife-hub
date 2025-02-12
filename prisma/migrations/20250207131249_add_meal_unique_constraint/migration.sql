/*
  Warnings:

  - A unique constraint covering the columns `[user_id,date,meal_type]` on the table `meal_records` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `meal_records_user_id_date_meal_type_key` ON `meal_records`(`user_id`, `date`, `meal_type`);
