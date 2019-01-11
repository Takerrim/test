const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const User = require('../models/user');


exports.getSignUp = (req, res) => {
  let message = req.flash('error-login');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('./auth/signUp', {
    pageTitle: 'Регистрация',
    path: '/signup',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};


exports.postSignUp = (req,res) => {
  const name = req.body.nameUser;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('./auth/signup', {
      path: '/signup',
      pageTitle: 'Регистрация',
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array()
    });
  }
  User.findOne({email:email})
  .then(user => {
    if (user) {
    req.flash('error-login' , 'Такой пользователь уже существует');
    res.redirect('/signup');  
    }
/////* шифрование пароля */////
  bcrypt.hash(password,12)
  .then(hashedPassword => {
    const user = new User({
      name: name, 
      email: email,
      password: hashedPassword
    })
    return user.save()
    })
    .then(() => {
    res.redirect('/login')
    })
  })
  .catch(err => console.log(err))
}


exports.getLogin = (req, res) => {
/////* проверка валидации */////
  let message = req.flash('error-login');
  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('./auth/login', {
    pageTitle: 'Вход',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
  .then(user => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('./auth/login', {
      path: '/login',
      pageTitle: 'Войти',
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  };
    bcrypt.compare(password, user.password)
    .then(isMatched => { 
      if(!isMatched) {
        return res.redirect('/login');
      }
      req.session.isLoggedIn  = true; 
      req.session.user = user;
      res.redirect('/user');
    }) 
  })
    .catch(err => console.log(err));
}

exports.logout = (req,res) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}
