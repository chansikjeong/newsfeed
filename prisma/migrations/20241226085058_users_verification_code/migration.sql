/*
  Warnings:

  - You are about to drop the column `verificationCode` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `verificationCode`,
    ADD COLUMN `veificationCode` VARCHAR(191) NULL;
