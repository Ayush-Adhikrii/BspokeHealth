const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const xss = require('xss');
const validator = require('validator');

const getActivityLogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  let { userId, action, from, to } = req.query;
  const where = {};

  if (userId && validator.isInt(userId.toString())) {
    where.userId = parseInt(userId);
  }

  if (action) {
    action = xss(action.trim());
    where.action = action;
  }

  if (from || to) {
    where.timestamp = {};
    if (from && validator.isISO8601(from)) {
      where.timestamp.gte = new Date(from);
    }
    if (to && validator.isISO8601(to)) {
      where.timestamp.lte = new Date(to);
    }
  }

  try {
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, role: true } }
        }
      }),
      prisma.activityLog.count({ where })
    ]);

    res.json({
      logs,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Failed to fetch activity logs:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
};

module.exports = { getActivityLogs };
