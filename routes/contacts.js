import express from "express";
import { db }  from "../db/db-contacts.js";
import {isValidId, isValidEmail} from "../helper.js";
import auth from "../auth/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, async(req, res) => {
    try {
        const contacts = await db.getAllContacts();
        res.json({contacts});
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Une erreur interne est survenue."
        });
    }
});

contactsRouter.get("/:id", auth, async(req, res) => {
    try {
        const id = Number(req.params.id);
        if (!isValidId(id)) {
            return res.status(400).json({ error: "ID invalide" });
        }
        const contact = await db.getContactById(id);
        if (contact === undefined) {
            res.status(404).json({error: "Contact non trouvé"});
        } else {
            res.json({contact});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Une erreur interne est survenue."
        });
    }
});

contactsRouter.post("/", auth, async (req, res) => {
    try {
        //object destructuring
        const {name, email} = req.body;
        if (!isValidEmail(email)) {
            return res.status(400).json({error: "Email non valide"});
        }
        const newContact = await db.createContact({name, email});
        const message = `Le contact ${newContact.name} a bien été créé !`;
        res.status(201).json({
            message: message,
            contact: newContact
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Une erreur interne est survenue."
        });
    }
});

contactsRouter.put('/:id', auth, async(req, res) => {
    try {
        const id = Number(req.params.id);
        // we could check the id again, like for the get with id
        const {name, email} = req.body;
        const resUpdateContactNb = await db.updateContact(id, {name, email});
        if (resUpdateContactNb === 0) {
            res.status(404).json({error: "Contact non trouvé"});
        } else {
            const contactUpdated = await db.getContactById(id);
            res.json({message: 'Contact updated', contact : {contactUpdated}});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Une erreur interne est survenue."
        });
    }
});

contactsRouter.delete('/:id', auth, async(req, res) => {
    try {
        const id = Number(req.params.id);
        // we could check the id again, like for the get with id
        let deletedContact = await db.deleteContact(id)
        if (deletedContact.success) {
            res.json({message: 'Contact deleted'});
        } else {
            res.status(404).json({error: "Contact non trouvé."});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Une erreur interne est survenue."
        });
    }
});

export default contactsRouter;