-- CreateTable
CREATE TABLE `UserTarget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `calories` INTEGER NOT NULL,
    `protein` DOUBLE NOT NULL,
    `carbs` DOUBLE NOT NULL,
    `fat` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
