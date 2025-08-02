-- CreateTable
CREATE TABLE "DoctorAvailability" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_recurring" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultationFee" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "consultation_type" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NPR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultationFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "time_slot_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "symptoms" TEXT,
    "notes" TEXT,
    "cancellation_reason" TEXT,
    "follow_up_recommended" BOOLEAN NOT NULL DEFAULT false,
    "follow_up_appointment_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NPR',
    "payment_method" TEXT NOT NULL,
    "transaction_id" TEXT,
    "status" TEXT NOT NULL,
    "refund_amount" DECIMAL(10,2),
    "refund_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DoctorAvailability_doctor_id_idx" ON "DoctorAvailability"("doctor_id");

-- CreateIndex
CREATE INDEX "TimeSlot_doctor_id_date_is_available_idx" ON "TimeSlot"("doctor_id", "date", "is_available");

-- CreateIndex
CREATE INDEX "ConsultationFee_doctor_id_idx" ON "ConsultationFee"("doctor_id");

-- CreateIndex
CREATE INDEX "Appointment_patient_id_idx" ON "Appointment"("patient_id");

-- CreateIndex
CREATE INDEX "Appointment_doctor_id_idx" ON "Appointment"("doctor_id");

-- CreateIndex
CREATE INDEX "Appointment_time_slot_id_idx" ON "Appointment"("time_slot_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_appointment_id_key" ON "Payment"("appointment_id");

-- CreateIndex
CREATE INDEX "Payment_appointment_id_idx" ON "Payment"("appointment_id");

-- CreateIndex
CREATE INDEX "Payment_transaction_id_idx" ON "Payment"("transaction_id");

-- AddForeignKey
ALTER TABLE "DoctorAvailability" ADD CONSTRAINT "DoctorAvailability_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationFee" ADD CONSTRAINT "ConsultationFee_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
