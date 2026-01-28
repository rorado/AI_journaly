/*
  Warnings:

  - Changed the type of `mood` on the `Analysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "mood" AS ENUM ('happy', 'sad', 'neutral');

-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "mood",
ADD COLUMN     "mood" "mood" NOT NULL;
