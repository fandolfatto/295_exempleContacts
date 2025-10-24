import express from "express";
import { db_users }  from "../db/db-users.mjs";
import {isValidId} from "../helper.mjs";
import {db} from "../db/db-contacts.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {privateKey} from "../auth/private_key.mjs"

const usersRouter = express.Router();

usersRouter.post("/signup", async (req, res) => {
    try {
        const user = req.body;
        const newContact = await db_users.createUser(user.username, user.password);
        const message = `Le contact ${newContact.username} a bien été créé !`;
        res.json({message: message, contact: newContact});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

usersRouter.post("/login", async (req, res) => {
    try {
        const userInfo = req.body;
        const user = await db_users.getUserByUserName(userInfo.username);
        if (user === undefined) {
            //For security reason (nobody needs to know the user is not defined in the DB), the message is general
            res.status(401).json({error: "Login / mot de passe incorrects"});
        } else {
            const isPwdValid = await bcrypt.compare(req.body.password, user.password)
            if (!isPwdValid) {
                res.status(401).json({error: "Login / mot de passe incorrects"});
            } else {
                const token = jwt.sign(
                    { userId: user.id },
                    privateKey,
                    { expiresIn: '1y' }
                )
                res.status(200).json({message: 'user connecté', token: token});
            }
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default usersRouter;