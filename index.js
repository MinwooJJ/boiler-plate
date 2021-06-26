const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { User } = require('./models/user');
const cookieParser = require('cookie-parser');
const port = 5000;

const config = require('./config/key');

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB is conneted!'))
  .catch((error) => console.error(error));

// application/json, json 데이터 해석
app.use(express.json());
// application/x-www-form-urlencoded, form 데이터 해석
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', (req, res) => {
  const user = new User(req.body);

  // client에서 받은 정보들을 user model에 저장
  user.save((err, userInfo) => {
    if (err) {
      return res.json({ success: false, err });
    }

    return res.status(200).json({ success: true });
  });
});

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'e-mail does not exist',
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: 'Password does not match',
        });
      }

      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }

        // token 저장, cookie or localstorage, 현재 cookie 사용
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
