-- CreateTable
CREATE TABLE "Medicine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "manufacturer" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "discount_price" DOUBLE PRECISION,
    "category" TEXT,
    "image_url" TEXT,
    "in_stock" BOOLEAN NOT NULL DEFAULT true,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "prescription_required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);
