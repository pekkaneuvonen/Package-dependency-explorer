const express = require('express');
const { request } = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
})

app.get('/download/:platform', (request, res) => {
  let file;
  if (request.params.platform === "mac") {
    file = 'PDE-mac.zip';
  } else if (request.params.platform === "win") {
    file = 'PDE.snap';
  } else if (request.params.platform === "linux") {
    file = 'PDE.AppImage';
  }
  if (file) {
    res.download(`./download/${file}`, (err) => {
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
      } else {
        // decrement a download credit, etc.
      }
    })
  }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})