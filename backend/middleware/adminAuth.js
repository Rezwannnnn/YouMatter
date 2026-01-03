import User from '../models/user.model.js';

// Check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user is admin or staff
export const isAdminOrStaff = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin' && user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied. Staff or Admin only.' });
    }

    req.userRole = user.role; // Attach role to request
    next();
  } catch (error) {
    console.error('Admin/Staff auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

