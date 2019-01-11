const router = require('express').Router();
const mainController = require('../controllers/main');

router.get('/', mainController.mainPage);
router.get('/user', mainController.getInfo);




module.exports = router;