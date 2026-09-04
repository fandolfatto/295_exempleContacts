//On importe le module express (il doit être installé avec "npm install express")
import express from 'express';
import contactsRouter from './routes/contacts.js';
// On crée une application Express
const app = express();
// On définit le port sur lequel le serveur va écouter
const port = process.env.PORT || 3001;

app.use(express.json());

// On crée une route GET sur la racine ("/")
// Quand un utilisateur ouvre http://localhost:3000/ dans son navigateur,
// cette fonction est appelée et envoie "Hello World!" en réponse
//app.get('/', (req, res) => {
//    res.send('Hello World!')
//})

app.use('/api/contacts', contactsRouter);

// Si aucune route ne correspondant à l'URL demandée par le consommateur
// ({ res }) => { ... }  : on utilise la déstructuration disponible en javascript pour extraire res
// de l'objet argument. Cette fonction fléchée prend un objet en entrée qui a au moins une propriété res , qui est l'objet de
// réponse Express
app.use(({ res }) => {
    const message =
        "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
    res.status(404).json(message);
});

// On démarre le serveur et on lui dit d’écouter sur le port défini
// Une fois lancé, le message est affiché dans la console
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})