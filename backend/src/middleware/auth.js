const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-key';

// Verify token, attach payload to req.user
exports.requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid auth header' });
  }
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Only allow manufacturers through
exports.requireManufacturer = (req, res, next) => {
  if (req.user.role !== 'manufacturer') {
    return res.status(403).json({ message: 'Forbidden: manufacturers only' });
  }
  next();
};
