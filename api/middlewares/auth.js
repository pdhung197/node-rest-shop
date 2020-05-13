const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const method = req.method;

        if (method === 'GET') return next();
        const authorizationToken = req.headers.authorization;
        const token = authorizationToken && authorizationToken.length
            ? authorizationToken.replace('Bearer ', '')
            : req.cookies['utk'];
        const verify = token && token.length
            ? jwt.verify(token, process.env.JWT_KEY)
            : false;

        if (verify) {
            req.userData = verify;
            return next();
        }
        throw new Error();
    } catch (error) {
        res.status(401).json({
            message: 'Auth failed'
        })
    }
};

module.exports = auth;
