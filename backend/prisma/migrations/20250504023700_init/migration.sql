-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'Patient',
    "password" TEXT NOT NULL,
    "kyc_status" VARCHAR(50) NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KYC" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "document_url" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Pending',
    "reviewed_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KYC_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "KYC_user_id_key" ON "KYC"("user_id");

-- AddForeignKey
ALTER TABLE "KYC" ADD CONSTRAINT "KYC_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
