const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.port || 3001;

const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//GET Route for retrieving all notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read notes from the database' });
        }
        res.json(JSON.parse(data));
    });
});

// POST Route for adding a new note
app.post('/api/notes', (req, res) => {
    // Read the existing notes from the database
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read notes from the database' });
        }

        let notes = JSON.parse(data);

        const newNote = {
            id: notes.length + 1,
            title: req.body.title,
            text: req.body.text
        };

        notes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to write notes to the database' });
            }
            res.json(newNote);
        });
    });
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);