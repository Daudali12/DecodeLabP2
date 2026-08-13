function validateUser(req, res, next) {
  const { name, email } = req.body;
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';

  if (!trimmedName || !trimmedEmail) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required'
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  return next();
}

module.exports = { validateUser };
