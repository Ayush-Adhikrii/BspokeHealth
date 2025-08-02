-- CreateTable
CREATE TABLE "TrustedDevices" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustedDevices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrustedDevices_deviceId_key" ON "TrustedDevices"("deviceId");

-- AddForeignKey
ALTER TABLE "TrustedDevices" ADD CONSTRAINT "TrustedDevices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
