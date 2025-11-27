-- Step 1: Add password column as nullable first
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(191) NULL;

-- Step 2: Update existing users with a placeholder password hash
-- This is a bcrypt hash of "temp_reset_required" 
-- Existing users will need to use the forgot password flow to set their password
UPDATE `user` SET `password` = '$2b$10$Go96ZqJ8fzIGWBC6PlVTYugTourLEzdDsEFVGgGoioF04zXVwc8ii' WHERE `password` IS NULL;

-- Step 3: Make password required
ALTER TABLE `user` MODIFY COLUMN `password` VARCHAR(191) NOT NULL;

-- Step 4: Add other authentication fields
ALTER TABLE `user` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `otp` VARCHAR(191) NULL,
    ADD COLUMN `otpExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `resetExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `resetToken` VARCHAR(191) NULL;
