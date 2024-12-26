/*
  Warnings:

  - You are about to drop the column `veificationCode` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `veificationCode`,
    ADD COLUMN `verificationCode` VARCHAR(191) NULL;
