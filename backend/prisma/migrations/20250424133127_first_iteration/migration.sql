-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Developer" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "YOE" DECIMAL(65,30) NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "overall_rating" TEXT NOT NULL,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "developer_id" TEXT NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("developer_id","id")
);

-- CreateTable
CREATE TABLE "Room" (
    "Roomid" TEXT NOT NULL,
    "admin" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("Roomid")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roomid" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "timeline" INTEGER NOT NULL,
    "required_developers" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "message_created_by" TEXT NOT NULL,
    "createdby" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DeveloperToRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DeveloperToRoom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DeveloperToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DeveloperToProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Developer_Email_key" ON "Developer"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Developer_Phone_key" ON "Developer"("Phone");

-- CreateIndex
CREATE UNIQUE INDEX "Developer_overall_rating_key" ON "Developer"("overall_rating");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_id_key" ON "Skill"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Project_roomid_key" ON "Project"("roomid");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_room_id_key" ON "Chat"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_message_created_by_key" ON "Chat"("message_created_by");

-- CreateIndex
CREATE INDEX "_DeveloperToRoom_B_index" ON "_DeveloperToRoom"("B");

-- CreateIndex
CREATE INDEX "_DeveloperToProject_B_index" ON "_DeveloperToProject"("B");

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "Room"("Roomid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("Roomid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeveloperToRoom" ADD CONSTRAINT "_DeveloperToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeveloperToRoom" ADD CONSTRAINT "_DeveloperToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("Roomid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeveloperToProject" ADD CONSTRAINT "_DeveloperToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeveloperToProject" ADD CONSTRAINT "_DeveloperToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
