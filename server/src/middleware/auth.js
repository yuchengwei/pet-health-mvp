const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: '未登录' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pet-health-secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: '登录已过期' });
  }
};

module.exports = authMiddleware;