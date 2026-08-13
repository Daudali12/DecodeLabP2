const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');

const router = express.Router();

router.get('/', getUsers);
router.post('/', validateUser, createUser);

module.exports = router;
