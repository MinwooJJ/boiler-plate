const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// user.save 이전에 할 동작 정의
const saltRounds = 10;
userSchema.pre('save', function (next) {
  var user = this;

  // 비밀번호가 바뀔때만 암호화가 되야 하는 조건
  if (user.isModified('password')) {
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        console.error(err);
        return next(err);
      }

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          console.error(err);
          return next(err);
        }

        user.password = hash;
        next();
      });
    });
  } else {
    // 비밀번호 이외 변경 할 경우 조건
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;

  // jsonwebtoken을 사용하여 token 생성
  // db의 id
  var token = jwt.sign(user._id.toHexString(), 'secretToken');

  // user._id와 'secretToken' 을 사용하여 token을 만듬, client에서 'secretToken'을 넣으면 user._id 반환
  user.token = token;
  user.save(function (err, user) {
    if (err) {
      return cb(err);
    }

    cb(null, user);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
