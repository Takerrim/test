const router = require('express').Router();
const authController = require('../controllers/auth');
const { check, body } = require('express-validator/check');


/////* регистрация */////
router.get('/signup', authController.getSignUp);
router.post('/signup',
[
  check('email')
    .isEmail()
    .withMessage('Пожалуйста, введите корректный электронный адрес.')
    .normalizeEmail(),
  body(
    'password',
    'Пожалуйста, введите пароль с не менее 5 символами.'
  )
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim()
  ], authController.postSignUp);

/////* авторизация */////
router.get('/login', authController.getLogin);
router.post('/login', 
[
  body('email')
    .isEmail()
    .withMessage('Пожалуйста, введите корректный электронный адрес.')
    .normalizeEmail(),
  body('password', 'Неправильный или некорректный пароль.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim()
],authController.postLogin);

/////* выход ///// ; 
router.post('/logout', authController.logout);

module.exports = router;