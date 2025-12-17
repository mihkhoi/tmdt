-- Script to add missing EMAIL_VERIFIED and EMAIL_VERIFICATION_CODE columns to users table
-- Run this if Hibernate auto-update doesn't work

-- Add EMAIL_VERIFIED column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Add EMAIL_VERIFICATION_CODE column if it doesn't exist  
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_code VARCHAR(100);

-- Update existing rows to have email_verified = false
UPDATE users SET email_verified = FALSE WHERE email_verified IS NULL;
