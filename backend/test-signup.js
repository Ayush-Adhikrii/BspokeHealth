const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPatientCreation() {
  try {
    console.log('Testing patient creation...');
    
    // Test creating a patient without kyc_status
    const testPatient = await prisma.patient.create({
      data: {
        phone_number: "1234567890",
        date_of_birth: new Date("1990-01-01"),
        gender: "Male",
        userId: 1, // Assuming user ID 1 exists
      },
    });
    
    console.log('Patient created successfully:', testPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPatientCreation(); 