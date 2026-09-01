import express from "express";
import { db }  from "../db/db-contacts.js";

//Code made in ase of success, we do not treat here the error case (id not existing for example)

const contactsRouter = express.Router();
contactsRouter.get("/", async(req, res) => {
    const contacts = await db.getAllContacts();
    res.json({contacts});
});

contactsRouter.get("/:id", async(req, res) => {
    const id = parseInt(req.params.id);
    const contact = await db.getContactById(id);
    res.json({contact});
});

contactsRouter.post("/", async (req, res) => {
    //object destructuring
    const {name, email} = req.body;
    const newContact = await db.createContact({name, email});
    const message = `Le contact ${newContact.name} a bien été créé !`;
    res.json({message : message, contact : newContact});
});

contactsRouter.put('/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const contactUpdated = await db.updateContact(id, {name, email});
    res.json({ message: 'Contact updated', contact: contactUpdated });
});

contactsRouter.delete('/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    let deletedContact = await db.deleteContact(id)
    res.json({ message: 'Contact deleted' });
});

export default contactsRouter;