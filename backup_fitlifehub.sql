/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.5.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: fitlifehub
-- ------------------------------------------------------
-- Server version	11.6.2-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Glass`
--

DROP TABLE IF EXISTS `Glass`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Glass` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Glass`
--

LOCK TABLES `Glass` WRITE;
/*!40000 ALTER TABLE `Glass` DISABLE KEYS */;
/*!40000 ALTER TABLE `Glass` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES
('159278bd-e707-4da5-8713-11c5a6d8fbd3','366a9bb76c274a292abe80fc7bc92f8adc8f735810b17722510205fd38588a37','2025-01-27 15:44:52.251','20250124192539_',NULL,NULL,'2025-01-27 15:44:52.226',1),
('345d2a72-826f-4b12-9638-4f4993259484','b29afcb7c538938e1a0bc9b1dbb45d6dab09650a2c815a8c0a6276016e1823dd','2025-01-27 15:44:52.274','20250124193315_update_activity_level_enum',NULL,NULL,'2025-01-27 15:44:52.253',1),
('78f6a01b-c0e7-40e0-a9b6-e48bf7dd1729','b613a8dc7eaccdced18c7fae58a03a3a59e1649798d0ccf75a4dee897481ef1c','2025-01-27 15:44:52.031','20250117072625_init',NULL,NULL,'2025-01-27 15:44:52.005',1),
('89870b67-aba2-42c2-9b59-c85c5fd63781','5dbffc7832963bb469a6843ad3a57dfe9676e8c2d3f8d2444bffa96647aaab89','2025-01-27 15:44:52.196','20250124174306_init',NULL,NULL,'2025-01-27 15:44:52.174',1),
('8b06d762-b514-4d61-baa2-c8f9ccc97983','e7f22ef6c2292504041981e990598b4f5edf9a9ff0862571d31f1c0ee794d62b','2025-01-27 15:44:52.002','20250116165408_add_role_relation',NULL,NULL,'2025-01-27 15:44:51.899',1),
('aa702628-1fa0-4087-9162-d164c5933005','f0db115cc301e3c65a2b4d7fc82f885b3a24d72478b27dd9373e6af47afa0a3e','2025-01-27 15:44:52.137','20250120161307_',NULL,NULL,'2025-01-27 15:44:52.116',1),
('ac6241c9-a921-4bf1-83b2-d3e5865b1713','d463eb3025edc4c1bc158f4cd2d98f0b766f1376bd7f10705baaa64da037c061','2025-01-27 15:44:52.225','20250124190814_rename_gender_to_sex',NULL,NULL,'2025-01-27 15:44:52.198',1),
('af1d7712-e912-42fb-a041-a36dbc7a4e55','d1a1ce34a0d0a8e182ee0345dba4777a3292e50ea240bf0428a3c662265c0f7b','2025-01-27 15:44:51.700','20250113074435_init',NULL,NULL,'2025-01-27 15:44:51.445',1),
('af51c965-36d3-4287-9c61-89bb6a470f54','7dacd7102a33d22876d4777ecc8e31141370f588dd38ac734faaf3cf44e83a75','2025-01-27 15:44:51.896','20250113094023_add_role_relationship',NULL,NULL,'2025-01-27 15:44:51.785',1),
('b81f861c-b980-4639-87e9-f186bc5edd5c','fd0cb1e963a4528145a1451069dc7caa8f4cf560e24918341312d1db222bfe7f','2025-01-27 15:44:52.090','20250117165547_init',NULL,NULL,'2025-01-27 15:44:52.074',1),
('bdaab0ff-6a2b-42c0-95e7-7924bec76140','ae9d427e45b5eb6981d42b6c5e0043b3c0a9e18e7e19528a1c2c1453af3bfc61','2025-01-27 15:44:52.170','20250123174603_add_birthday_to_users',NULL,NULL,'2025-01-27 15:44:52.141',1),
('cce7b2f2-4c2a-45a1-b331-e25f6a89d936','cdee692ee57fdddf69ef22ac6d5bac03c62b6e880d572b0e95250413ad6be1e7','2025-01-27 15:44:52.071','20250117084400_',NULL,NULL,'2025-01-27 15:44:52.035',1),
('ee046677-d15c-44f7-9843-9102a6f84cc1','065188feb552f7ae8e680fe5daeb929e719d1dfb3757a29602fe4e4add90d110','2025-01-27 15:44:51.781','20250113091517_init',NULL,NULL,'2025-01-27 15:44:51.707',1),
('f031ed18-f803-4867-a452-00bfd3fbbc48','370a26c9b95be95b2f7028a63addb36a0f75b0209c34888b232642e94f347f51','2025-01-27 15:44:52.113','20250120155957_glass',NULL,NULL,'2025-01-27 15:44:52.092',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diet_goals`
--

DROP TABLE IF EXISTS `diet_goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diet_goals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `daily_calories` float NOT NULL,
  `daily_protein` float DEFAULT 0,
  `daily_carbs` float DEFAULT 0,
  `daily_fat` float DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `diet_goals_user_id_key` (`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `diet_goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diet_goals`
--

LOCK TABLES `diet_goals` WRITE;
/*!40000 ALTER TABLE `diet_goals` DISABLE KEYS */;
/*!40000 ALTER TABLE `diet_goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foods`
--

DROP TABLE IF EXISTS `foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `foods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `calories` decimal(5,2) DEFAULT 0.00,
  `protein` decimal(5,2) DEFAULT 0.00,
  `carbs` decimal(5,2) DEFAULT 0.00,
  `fat` decimal(5,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `category` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `type_of_food` enum('Vegetarian','Non-Vegetarian','Vegan','Gluten-Free') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
/*!40000 ALTER TABLE `foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_items`
--

DROP TABLE IF EXISTS `meal_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meal_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meal_record_id` int(11) NOT NULL,
  `food_id` int(11) NOT NULL,
  `quantity` float NOT NULL,
  `calories` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `food_id` (`food_id`),
  KEY `meal_record_id` (`meal_record_id`),
  CONSTRAINT `meal_items_ibfk_1` FOREIGN KEY (`meal_record_id`) REFERENCES `meal_records` (`id`) ON DELETE CASCADE,
  CONSTRAINT `meal_items_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_items`
--

LOCK TABLES `meal_items` WRITE;
/*!40000 ALTER TABLE `meal_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `meal_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_records`
--

DROP TABLE IF EXISTS `meal_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meal_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `meal_type` enum('breakfast','lunch','dinner','snack') DEFAULT NULL,
  `date` date NOT NULL,
  `total_calories` float DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `meal_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_records`
--

LOCK TABLES `meal_records` WRITE;
/*!40000 ALTER TABLE `meal_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `meal_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `diet_goal` enum('weight_loss','muscle_gain','maintenance') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `roleId` bigint(20) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `sex` enum('male','female') DEFAULT NULL,
  `activity_level` enum('sedentary','light','moderate','active','veryActive') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `users_username_key` (`username`),
  KEY `users_roleId_fkey` (`roleId`),
  CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workouts`
--

DROP TABLE IF EXISTS `workouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `workouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `activity` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  `calories_burned` float NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `workouts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workouts`
--

LOCK TABLES `workouts` WRITE;
/*!40000 ALTER TABLE `workouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `workouts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-01-27 22:48:17
