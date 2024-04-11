// https://blockchain-bo3j.onrender.com 
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MONGOOSE

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://zoroetlufy:Pepito1&@cluster0.xdapwkb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
    // Ajoutez d'autres champs selon vos besoins
});

module.exports = mongoose.model('User', userSchema);
  
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
      }

      // Hacher le mot de passe et créer l'utilisateur
      const newUser = new User({ email, password }); // Vous devriez hacher le mot de passe avant de le stocker
      await newUser.save();

      res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
  }
});

app.get('/users', async (req, res) => {
  // Ici, ajoutez une vérification de l'authentification et des autorisations
  try {
      const users = await User.find({}); // Renvoie tous les utilisateurs
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
});

app.get('/users', async (req, res) => {
  // Ici, ajoutez une vérification de l'authentification et des autorisations
  try {
      const users = await User.find({}); // Renvoie tous les utilisateurs
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
});
/////////////////////////////////////////

// Simulez une base de données en mémoire
const users = [];

app.post('/firstco', (req, res) => {
    // Récupérer les données de la requête
    const username = req.body.username;
    console.log("Nom d'utilisateur : ", username);

    // Logique de traitement - à implémenter
    // Par exemple, vérification des informations d'identification, enregistrement dans la base de données, etc.

    // Réponse réussie
    res.status(200).json({ message: "Bonjour " + username });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("try to login with email: ", email, " and password: ", password);
  // Ici, vous devriez rechercher l'utilisateur dans votre base de données
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérifiez le mot de passe - dans une application réelle, le hash du mot de passe devrait être stocké et comparé
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ message: 'Mot de passe incorrect' });
  }

  // Générer un token JWT pour l'utilisateur
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Connexion réussie', token });
  console.log("Connexion réussie");
});

app.post('/register', async (req, res) => {
  console.log("try to register with email: ", req.body.email, " and password ", req.body.password); 
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword };
  users.push(newUser); // Dans une application réelle, vous devriez enregistrer l'utilisateur dans votre base de données
  console.log(users);
  res.status(201).json({ message: 'Utilisateur créé' });
  console.log("Utilisateur créé");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// app.post('/register', async (req, res) => {
//     const { email, password } = req.body;

//     // Vérifier si l'utilisateur existe déjà
//     const existingUser = users.find(user => user.email === email);
//     if (existingUser) {
//         return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
//     }

//     // Hacher le mot de passe avant de le stocker
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Créer un nouvel utilisateur (dans une application réelle, vous devriez sauvegarder cet utilisateur dans votre base de données)
//     const newUser = { email, password: hashedPassword };
//     users.push(newUser);

//     res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
// });
