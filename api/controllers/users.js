const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('./../models/user');

const signUp = (req, res, next) => {
    const { username } = req.body;
    User.find({ username })
        .exec()
        .then(user => {
            if (user && user.length) throw {
                message: 'User exists',
                errorCode: 409
            };
        })
        .then(() => bcrypt.hash(req.body.password, 12))
        .then((hash) => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: hash
            })
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'User created',
                result
            })
        })
        .catch(error => {
            res.status(error.errorCode || 500).json({
                error
            });
            return;
        });
};

const deleteUser = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then((result) => res.status(200).json({ result }))
        .catch(error => res.status(500).json({ error }))
};

const login = (req, res, next) => {
    User.find({
        username: req.body.username,
    })
        .exec()
        .then(users => {
            if (!users || !users.length)
                return res.status(400).json({
                    message: 'Auth failed'
                });
            return users;
        })
        .then((users) => bcrypt.compare(req.body.password, users[0].password))
        .then((result) => {
            if (!result) throw {
                error: 'Wrong password',
                errorCode: 401
            }
            const token = jsonwebtoken.sign(
                {
                    username: req.body.username
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '1h'
                }
            );
            res.cookie('utk', token, { expire: new Date() + 1000 * 60 * 60 });
            res.status(200).json({
                message: 'Login successed',
                token
            })
        })
        .catch(error => {
            res.status(error.errorCode || 500).json({ error })
        })
};

module.exports = {
    signUp,
    login,
    deleteUser
};
