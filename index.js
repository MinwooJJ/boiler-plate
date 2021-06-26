const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = 5000;

mongoose
  .connect(
    'mongodb+srv://minwoo:4119694jmw@boilerplate.i1ydx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log('MongoDB is conneted!'))
  .catch((error) => console.error(error));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
