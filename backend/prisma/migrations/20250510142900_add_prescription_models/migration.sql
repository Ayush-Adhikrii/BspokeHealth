/*
  Warnings:

  - A unique constraint covering the columns `[time_slot_id]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "diagnosis" TEXT,
    "doctor_notes" TEXT,
    "follow_up_needed" BOOLEAN NOT NULL DEFAULT false,
    "follow_up_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" SERIAL NOT NULL,
    "prescription_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "instructions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_appointment_id_key" ON "Prescription"("appointment_id");

-- CreateIndex
CREATE INDEX "Prescription_appointment_id_idx" ON "Prescription"("appointment_id");

-- CreateIndex
CREATE INDEX "Medication_prescription_id_idx" ON "Medication"("prescription_id");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_time_slot_id_key" ON "Appointment"("time_slot_id");

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
