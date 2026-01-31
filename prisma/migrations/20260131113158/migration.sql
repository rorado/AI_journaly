/*
  Warnings:

  - Added the required column `advice` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "advice" TEXT NOT NULL;
