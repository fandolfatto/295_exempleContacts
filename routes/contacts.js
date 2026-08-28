import express from "express";
import contacts from "../db/mock-contacts.js";

//Code made in case of success, we do not treat here the error cases (id not existing for example)

// Creation of a router that enables to manage contacts
// This router has several routes  with different HTTP methods, different endpoints
// An Express router allows you to group multiple routes related to the same resource or functionality.
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
    //object destructuring : get name and email properties of the req.body object and create 2 variables with these names.
    const {name, email} = req.body;
    // same result as the following way of writing
    // const name = req.body.name;
    // const email = req.body.email;
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
    // the same as {
    //     id: id,
    //     name: name,
    //     email: email
    // }
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