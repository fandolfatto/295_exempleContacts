import jwt from 'jsonwebtoken';
import {privateKey} from "./private_key.mjs";

const auth = (req, res, next) => {
    try {
        //req.headers.authorization contains something like 'Bearer eyxxxxxxxxxxxxx.yyyyyyyyyy'
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, privateKey);
        //decodedToken is something like { userId: 1, iat: 1759412902, exp: 1790970502 }, iat : token issued at, exp : token expired at (in seconds since 01.01.1970)
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();

    } catch(error) {
        res.status(401).json({ error : error.message });
    }
};

export default auth;