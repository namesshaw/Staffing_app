/*
  Warnings:

  - Made the column `roomid` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_roomid_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "roomid" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "Room"("Roomid") ON DELETE RESTRICT ON UPDATE CASCADE;
