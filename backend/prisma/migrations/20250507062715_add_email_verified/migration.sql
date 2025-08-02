-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "role" DROP DEFAULT,
ALTER COLUMN "role" SET DATA TYPE TEXT,
ALTER COLUMN "kyc_status" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "nmc_number" TEXT NOT NULL,
    "speciality" TEXT NOT NULL,
    "educational_qualification" TEXT NOT NULL,
    "years_of_experience" INTEGER NOT NULL,
    "former_organisation" TEXT,
    "cv_url" TEXT,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "phone_number" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "gender" TEXT,
    "last_appointment" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_nmc_number_key" ON "Doctor"("nmc_number");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_userId_key" ON "Doctor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
