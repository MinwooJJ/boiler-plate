const { User } = require('../models/user');

// 인증 처리
let auth = (req, res, next) => {
  // client cookie에서 token을 받음
  let token = req.cookies.x_auth;

  // token을 decode 한 후 user를 찾음
  User.findByToken(token, (err, user) => {
    if (err) {
      throw err;
    }

    if (!user) {
      return res.json({ isAuth: false, error: true });
    }

    req.token = token;
    req.user = user;

    next();
  });
};

module.exports = { auth };
