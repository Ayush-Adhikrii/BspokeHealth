const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Logs a user activity to the ActivityLog table.
 * @param {number} userId - The user's ID
 * @param {string} action - The action performed (e.g., 'signup', 'login')
 * @param {string} details - Details about the action
 */
async function logActivity(userId, action, details) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        details,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

module.exports = { logActivity }; 