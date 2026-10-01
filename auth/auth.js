import jwt from 'jsonwebtoken';
import {privateKey} from "./private_key.js";

const auth = (req, res, next) => {
    try {
        //req.headers.authorization contains something like 'Bearer eyxxxxxxxxxxxxx.yyyyyyyyyy'
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                error: "Token manquant"
            });
        }

        const parts = authorization.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                error: "Format du token invalide"
            });
        }

        const token = parts[1];

        //decodedToken (payload part) is something like { userId: 1, iat: 1759412902, exp: 1790970502 }, iat : token issued at, exp : token expired at (in seconds since 01.01.1970)
        const decodedToken = jwt.verify(token, privateKey);

        req.auth = {
            userId: decodedToken.userId
        };

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            error: "Token invalide ou expiré"
        });
    }
};

export default auth;