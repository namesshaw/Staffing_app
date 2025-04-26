/*
  Warnings:

  - The `rating` column on the `Developer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Developer" DROP COLUMN "rating",
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Skill" ALTER COLUMN "rating" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "rating" SET DEFAULT 0;
