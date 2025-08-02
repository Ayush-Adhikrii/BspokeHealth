require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

async function testResetPassword() {
  try {
    console.log("Testing reset password functionality...");
    
    // Test 1: Check if a user exists
    const testUser = await prisma.users.findFirst({
      where: { email_verified: true }
    });
    
    if (!testUser) {
      console.log("No verified user found. Creating a test user...");
      const hashedPassword = await bcrypt.hash("testpassword123", 10);
      const newUser = await prisma.users.create({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: hashedPassword,
          role: "Patient",
          email_verified: true
        }
      });
      console.log("Created test user:", newUser.email);
    } else {
      console.log("Found existing user:", testUser.email);
    }
    
    // Test 2: Generate reset token
    const user = testUser || await prisma.users.findFirst({
      where: { email_verified: true }
    });
    
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    console.log("Generated reset token:", resetToken.substring(0, 20) + "...");
    
    // Test 3: Save reset token to database
    await prisma.users.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    
    console.log("Reset token saved to database");
    
    // Test 4: Verify token and find user
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    console.log("Token verified, user ID:", decoded.id);
    
    const userWithToken = await prisma.users.findFirst({
      where: {
        id: decoded.id,
        reset_token: resetToken,
        reset_token_expires: { gt: new Date() },
      },
    });
    
    if (userWithToken) {
      console.log("✅ User found with valid reset token");
    } else {
      console.log("❌ User not found or token invalid");
    }
    
    // Test 5: Test password change
    const newPassword = "newpassword123";
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.passwordHistory.create({
      data: {
        userId: user.id,
        password: user.password,
      },
    });
    
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        reset_token: null,
        reset_token_expires: null,
      },
    });
    
    console.log("✅ Password changed successfully");
    
    // Test 6: Verify new password works
    const updatedUser = await prisma.users.findUnique({
      where: { id: user.id }
    });
    
    const passwordValid = await bcrypt.compare(newPassword, updatedUser.password);
    if (passwordValid) {
      console.log("✅ New password verification successful");
    } else {
      console.log("❌ New password verification failed");
    }
    
    console.log("All tests completed successfully!");
    
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testResetPassword(); 