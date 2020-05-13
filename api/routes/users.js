const express = require('express');
const router = express.Router();

const userControllers = require('./../controllers/users');
const auth = require('./../middlewares/auth');

router.post('/signup', userControllers.signUp);

router.delete('/:userId', auth, userControllers.deleteUser);

router.post('/login', userControllers.login);

module.exports = router;