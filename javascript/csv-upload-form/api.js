const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

//a post endpoint that receives a csv file from multipart form and return a json object
app.post('/upload', multer().single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  if (file.mimetype !== 'text/csv') {
    return res.status(400).send('Only csv files are allowed.');
  }

  try {
    const csv = file.buffer.toString();
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      for (let i = 0; i < headers.length; i++) {
        obj[headers[i]] = values[i];
      }
      return obj;
    });
    fs.writeFile('data.json', JSON.stringify(data), { flag: 'a' }, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));