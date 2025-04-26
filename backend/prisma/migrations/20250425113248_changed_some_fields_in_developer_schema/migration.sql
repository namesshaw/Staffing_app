/*
  Warnings:

  - You are about to drop the column `Email` on the `Developer` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Developer` table. All the data in the column will be lost.
  - You are about to drop the column `Password` on the `Developer` table. All the data in the column will be lost.
  - You are about to drop the column `Phone` on the `Developer` table. All the data in the column will be lost.
  - You are about to drop the column `overall_rating` on the `Developer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Developer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Developer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Developer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Developer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Developer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Developer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Developer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Developer_Email_key";

-- DropIndex
DROP INDEX "Developer_Phone_key";

-- DropIndex
DROP INDEX "Developer_overall_rating_key";

-- AlterTable
ALTER TABLE "Developer" DROP COLUMN "Email",
DROP COLUMN "Name",
DROP COLUMN "Password",
DROP COLUMN "Phone",
DROP COLUMN "overall_rating",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "rating" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Developer_email_key" ON "Developer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Developer_phone_key" ON "Developer"("phone");
