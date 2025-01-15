-- CreateTable
CREATE TABLE `diet_goals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `daily_calories` FLOAT NOT NULL,
    `daily_protein` FLOAT NULL DEFAULT 0,
    `daily_carbs` FLOAT NULL DEFAULT 0,
    `daily_fat` FLOAT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `calories` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `protein` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `carbs` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `fat` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `category` VARCHAR(255) NULL,
    `source` VARCHAR(255) NULL,
    `type_of_food` ENUM('Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `meal_record_id` INTEGER NOT NULL,
    `food_id` INTEGER NOT NULL,
    `quantity` FLOAT NOT NULL,
    `calories` FLOAT NOT NULL,

    INDEX `food_id`(`food_id`),
    INDEX `meal_record_id`(`meal_record_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `meal_type` ENUM('breakfast', 'lunch', 'dinner', 'snack') NULL,
    `date` DATE NOT NULL,
    `total_calories` FLOAT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NULL,
    `age` INTEGER NULL,
    `gender` ENUM('male', 'female', 'other') NULL,
    `weight` FLOAT NULL,
    `height` FLOAT NULL,
    `activity_level` ENUM('sedentary', 'light', 'moderate', 'active', 'very active') NULL,
    `diet_goal` ENUM('weight_loss', 'muscle_gain', 'maintenance') NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workouts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `activity` VARCHAR(255) NOT NULL,
    `duration` INTEGER NOT NULL,
    `calories_burned` FLOAT NOT NULL,
    `date` DATE NOT NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `diet_goals` ADD CONSTRAINT `diet_goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `meal_items` ADD CONSTRAINT `meal_items_ibfk_1` FOREIGN KEY (`meal_record_id`) REFERENCES `meal_records`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `meal_items` ADD CONSTRAINT `meal_items_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `meal_records` ADD CONSTRAINT `meal_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `workouts` ADD CONSTRAINT `workouts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
