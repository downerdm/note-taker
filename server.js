const express = require('express');
const path = require('path');
const fs = require('fs');

let noteArray = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/api/notes', (req, res) => {
   fs.readFile('./db/db.json', (err, data) => {
    if (err) {
      res.status(500).json({
        error: err, message
      });
    }
   return res.json(JSON.parse(data));  
  })
    
})

// GET Route for notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

app.post('/api/notes', (req, res) => {

  console.log(noteArray);
  var uuid = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
    const { title, text} = req.body;

    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        uuid,
        title,
        text
      };
      // Convert the data to a string so we can save it
    //const noteString = JSON.stringify(newNote);
    noteArray.push(newNote);

    //Write the string to a file
    fs.writeFile(`./db/db.json`, JSON.stringify(noteArray), (err) =>
      err
        ? console.error(err)
        : console.log(
            `Review for ${newNote.uuid} has been written to JSON file`
          )
    );

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });