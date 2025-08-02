const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createPasswordHistoryTable() {
  try {
    console.log('Creating password history table...');
    
    // Create the password history table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "PasswordHistory" (
        "id" SERIAL NOT NULL,
        "userId" INTEGER NOT NULL,
        "password" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PasswordHistory_pkey" PRIMARY KEY ("id")
      );
    `;

    // Add foreign key constraint
    await prisma.$executeRaw`
      ALTER TABLE "PasswordHistory" 
      ADD CONSTRAINT "PasswordHistory_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

    console.log('Password history table created successfully!');
  } catch (error) {
    console.error('Error creating password history table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createPasswordHistoryTable(); 