-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_roomid_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "roomid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "Room"("Roomid") ON DELETE SET NULL ON UPDATE CASCADE;
