/*
  Warnings:

  - You are about to alter the column `YOE` on the `Developer` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `rating` on the `Skill` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Developer" ALTER COLUMN "YOE" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Skill" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;
