import express from "express";
import contacts from "../db/mock-contacts.js";

//Code made in ase of success, we do not treat here the error case (id not existing for example)

const contactsRouter = express.Router();
contactsRouter.get("/", (req, res) => {
    res.json({contacts});
});

contactsRouter.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const contact = contacts.find(contact => contact.id === id);
    res.json({contact});
});

contactsRouter.post("/", (req, res) => {
    const {name, email} = req.body;
    const id = contacts.length + 1; // Explain why it is not completly right and improve it
    const newContact={id, name, email};
    contacts.push(newContact);
    const message = `Le contact ${newContact.name} a bien été créé !`;
    res.json({message : message, contact : newContact});
});

contactsRouter.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const index = contacts.findIndex(contact => contact.id === id);
    //other way : const index = contacts.findIndex(getContact, id);
    contacts[index] = { id, name, email };
    res.json({ message: 'Contact updated', contact: contacts[index] });
});

/* other way without arrow functions
function getContact(contact) {
    if (contact.id == this) {
        return contact.id;
    }
}
*/

contactsRouter.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = contacts.findIndex(contact => contact.id === id);
    contacts.splice(index, 1);
    res.json({ message: 'Contact deleted' });
});

export default contactsRouter;