const express = require('express');
const { request } = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.static('build'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
})

app.get('/download/:platform', (request, res) => {
  let fileName;
  console.log("get ", request.params.platform);
  if (request.params.platform === "mac") {
    fileName = 'PDE.dmg';
  } else if (request.params.platform === "win") {
    fileName = 'PDE-win.zip';
  } else if (request.params.platform === "linux") {
    fileName = 'PDE.AppImage';
  }
  if (fileName) {
    res.download(__dirname + '/download/' + fileName, (err) => {
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
        console.log("err ", err);
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