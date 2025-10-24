import express from "express";
import { db }  from "../db/db-contacts.mjs";
import {isValidId, isValidEmail} from "../helper.mjs";
import auth from "../auth/auth.mjs";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, async(req, res) => {
    try {
        const contacts = await db.getAllContacts();
        res.json({contacts});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

contactsRouter.get("/:id", auth, async(req, res) => {
    try {
        const id = parseInt(req.params.id);
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
        res.status(500).json({error: error});
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
        res.json({message: message, contact: newContact});
    } catch (error) {
        res.status(500).json({error: error});
    }
});

contactsRouter.put('/:id', auth, async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {name, email} = req.body;
        const resUpdateContactNb = await db.updateContact(id, {name, email});
        if (resUpdateContactNb === 0) {
            res.status(404).json({error: "Contact non trouvé"});
        } else {
            const contactUpdated = await db.getContactById(id);
            res.json({message: 'Contact updated', contact : {contactUpdated}});
        }
    } catch (error) {
        res.status(500).json({error: error});
    }
});

contactsRouter.delete('/:id', auth, async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        let deletedContact = await db.deleteContact(id)
        if (deletedContact.success) {
            res.json({message: 'Contact deleted'});
        } else {
            res.status(404).json({error: "Contact non trouvé."});
        }
    } catch (error) {
        res.status(500).json({error: error});
    }
});

export default contactsRouter;