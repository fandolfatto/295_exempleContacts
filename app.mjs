//On importe le module express (il doit être installé avec "npm install express")
import express from 'express';
import contacts from "./db/mock-contacts.mjs";
// On crée une application Express qui est donnée au serveur HTTP pour qu'elle puisse traiter les requêtes reçues
const app = express();
// On définit le port sur lequel le serveur va écouter
const port = process.env.PORT || 3000;

app.use(express.json());

// On crée une route GET sur la racine ("/")
// Quand un utilisateur ouvre http://localhost:3000/ dans son navigateur,
// cette fonction est appelée et envoie la liste des contacts en réponse
app.get("/", (req, res) => {
    res.json({contacts});
});

app.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const contact = contacts.find(contact => contact.id === id);
    res.json({contact});
});


// On crée et démarre le serveur et on lui dit d’écouter sur le port défini
// Le serveur ransmettra ensuite les requêtes à l'application Express qui cherchera comment y répondre grâce à ses routes.
//On fait quelque chose de ce style en fait :
//const server = http.createServer(app);
//server.listen(3000);
// Une fois lancé, le message est affiché dans la console
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})