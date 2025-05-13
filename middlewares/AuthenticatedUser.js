const jwt = require('jsonwebtoken');
const JWT_SECRET = "your_secret_key";
const AuthenticatedUser = (req, resp, next) => {
    try {
        const authHeader = req.headers["authorization"]
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return resp.status(401).json({ message: 'token is not there in our authorization level' })
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return resp.status(403).json({ message: 'Invalid Token' });
            }
            req.user = user;

            next();
        })
    }
    catch (err) {
        return resp.status(500).json({ message: 'Server Error' });

    }

}

module.exports = { AuthenticatedUser }