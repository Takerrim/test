/////* стэк используемых технологий */////
// 1)MongoDB
// 2)Node.js
// 3)Ejs
// 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
/////* поключаем модуль сессии для поключения к бд */////
const MongoDBStore = require('connect-mongodb-session')(session); 
const MONGODB_URI = `mongodb+srv://Taker:nornor35@clustersecond-erq9e.mongodb.net/registration?retryWrites=true`;
const User = require('./models/user');
const flash = require('connect-flash');
const morgan = require('morgan');


const app = express(); 
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/main');

/////* устанавливаем шаблонизатор ejs и ставим место по умолчанию (views) */////
app.set('view engine', 'ejs');
app.set('views', 'views');
/////* устанавливаем место по умолчанию , где будут хранятся статические файлы (css,images,scripts) *///// 
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

/////* устанавливаем название коллекции сессии в бд  */////
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

/////* поключаем сессию к бд */////
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store 
  })
);

////* модуль валидации данных */////
app.use(flash());
////* модуль логгирования файлов */////
app.use(morgan('combined'));


/////* вытаскиваем информацию о юзере из сессии и передаем в объект запроса для общего доступа к юзеру  для всех  роутов*/////
app.use((req,res,next)=>{ 
  if(!req.session.user) {
      return next(); 
  }
  User.findById(req.session.user._id) 
  .then(user =>{
     req.user = user 
     next();
  })
  .catch(err => console.log(err))
})

app.use('/', authRoutes);
app.use('/', mainRoutes);

/////* подключению к бд
mongoose
  .connect(
    MONGODB_URI, {useNewUrlParser:true}
  )
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => console.log(err));

