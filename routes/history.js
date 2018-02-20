var express = require('express');
var router = express.Router();
var history = require('../model/history');
var event = require('../model/event');

/* GET home page. */
router.get('/:id', isLoggedIn, function (req, res, next) {

  history.readInfo(req.params.id, function(error, data) {
    if (error) {
      res.sendStatus(404);
    } else {
      res.render('history', { user: sess.usuarioDatos, product: data });
    }
  })
  
});



router.get('/read/:id', function (req, res, next) {
  var id = req.params.id;

  history.read(id,function (error, data) {
    if (error) {
      res.sendStatus(404);
    } else {
      res.send(data);
    }
  });
})

function isLoggedIn(req, res, next) {
  sess = req.session;
  if (sess.usuarioDatos)
    return next();
  sess.originalUrl = req.originalUrl;
  res.redirect('/login');
}

module.exports = router;
