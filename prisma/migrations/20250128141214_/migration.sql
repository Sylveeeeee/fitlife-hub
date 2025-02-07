-- Drop Foreign Key (ถ้ามีอยู่)
ALTER TABLE `diet_goals` 
DROP FOREIGN KEY IF EXISTS `diet_goals_ibfk_1`;

-- Drop Unique Index (ป้องกัน Duplicate Index)
DROP INDEX IF EXISTS `diet_goals_user_id_key` ON `diet_goals`;

-- Modify users table
ALTER TABLE `users`
    DROP COLUMN IF EXISTS `birthday`,
    DROP COLUMN IF EXISTS `sex`,
    ADD COLUMN IF NOT EXISTS `gender` ENUM('male', 'female', 'other') NULL,
    MODIFY `diet_goal` ENUM('weight_loss', 'muscle_gain', 'maintenance') NULL,
    MODIFY `roleId` BIGINT NULL,
    MODIFY `activity_level` ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') NULL;

-- Drop unused tables
DROP TABLE IF EXISTS `Glass`;
DROP TABLE IF EXISTS `post`;

-- Drop Existing Foreign Key on users.roleId (ถ้ามีอยู่ก่อน)
ALTER TABLE `users` 
DROP FOREIGN KEY IF EXISTS `users_roleId_fkey`;

-- Re-Add Foreign Key for users.roleId (ป้องกันซ้ำซ้อน)
ALTER TABLE `users` 
ADD CONSTRAINT `users_roleId_fkey` 
FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) 
ON DELETE CASCADE 
ON UPDATE CASCADE;