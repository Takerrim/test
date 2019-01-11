exports.getInfo = (req,res) => {
  res.render('mainPage', {
    pageTitle: 'Main page',
    path: '/user',
    isAuthenticated: req.session.isLoggedIn,
    user: req.user
  });
};


exports.mainPage = (req,res) => {
  res.render('mainPage', {
    pageTitle: 'Main page',
    path: '/',
    isAuthenticated: req.session.isLoggedIn,
    user: false
  });
};