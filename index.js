const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = 3000;

const quranData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'quran.json')));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
  });

app.get('/names.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','html', 'names.html'));
});

app.get('/quran.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'quran.html'));
  });

  app.get('/prayertimes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'prayertimes.html'));
  });

app.get('/versegenerator.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'versegenerator.html'));
});

app.get('/api/coran', (req, res) => {
    res.json(quranData);
});

app.get('/api/data', async (req, res) => {
    const userInput = req.query.input;  // Paramètre 'input' dans la requête

    const API_URL = `https://muslimsalat.com/${userInput}.json`;
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Retourner les données de prière au client
        res.json(data.items);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

app.get('/api/loc', async (req, res) => {
    const API_URL = 'https://ipinfo.io/json?token=c432ad7469dc96';
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Retourner les données de localisation au client (pas "items", mais les données appropriées)
        res.json(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});


// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
