const { users, nextId } = require('../data/users');

function getUsers(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: users
  });
}

function createUser(req, res) {
  const { name, email } = req.body;
  const newUser = {
    id: nextId(),
    name: name.trim(),
    email: email.trim()
  };

  users.push(newUser);
  return res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
}

module.exports = {
  getUsers,
  createUser
};
