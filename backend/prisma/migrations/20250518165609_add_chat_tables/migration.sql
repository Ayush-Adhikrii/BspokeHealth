-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" SERIAL NOT NULL,
    "chat_room_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "sender_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachment" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_appointment_id_key" ON "ChatRoom"("appointment_id");

-- CreateIndex
CREATE INDEX "ChatMessage_chat_room_id_idx" ON "ChatMessage"("chat_room_id");

-- CreateIndex
CREATE INDEX "ChatMessage_sender_id_idx" ON "ChatMessage"("sender_id");

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
