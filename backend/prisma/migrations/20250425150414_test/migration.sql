/*
  Warnings:

  - You are about to drop the column `rating` on the `Skill` table. All the data in the column will be lost.
  - Added the required column `name` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proficiency` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "rating",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "proficiency" TEXT NOT NULL;
