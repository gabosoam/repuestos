var express = require('express');
var router = express.Router();
var product = require('../model/product');
var event = require('../model/event');

/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render('producto', { user: sess.usuarioDatos });
});

router.get('/price', isLoggedInAdmin, function (req, res, next) {

    res.render('price', { user: sess.adminDatos });
 
});

router.get('/read', function (req, res, next) {
  product.read(function (error, data) {
    if (error) {
      res.sendStatus(404);
    } else {
      res.send(data);
    }
  });
})

router.get('/searchBarcode/', function (req, res, next) {


  product.searchBarcode(req.query.barcode,function (data) {
    res.send(data);
  });
})

router.get('/read/:id', function (req, res, next) {


  product.searchBarcodes(req.params.id,function (data) {
    res.send(data);
  });
})

router.get('/readprice', function (req, res, next) {
 
  product.readprice(function (error, data) {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
})

router.post('/updateprice',isLoggedInAdmin, function (req, res, next) {
  var datos = req.body;
  product.updateprice(datos, function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(data);
      if (data.affectedRows > 0) {

        var changes = {
          table: 'PRODUCT',
          values: JSON.stringify(datos),
          user: req.session.adminDatos.name,
          ip: req.ip,
          type: 'UPDATE'
        };

        event.create(changes, function (result) {
          console.log(result);
        });
        res.send(true);
      } else {
        res.sendStatus(500);
      }

    }
  })


})

router.post('/create2', function(req, res, next) {

  product.create2(req.body, function (error, result) {
    res.send(true);  
  })
  
})

router.post('/createSalida', function(req, res, next) {

  product.createSalida(req.body, function (error, result) {
    res.send(true);  
  })
  
})

router.post('/create', isLoggedIn, function (req, res, next) {
  var datos = req.body;

  product.create(datos, function (error, data) {
    if (error) {
      res.send(error);
    } else {

      var changes = {
        table: 'PRODUCT',
        values: JSON.stringify(datos),
        user: req.session.usuarioDatos.name,
        ip: req.ip,
        type: 'INSERT'
      };

      event.create(changes, function (result) {
        console.log(result);
      });
      
      res.send(data);
    }
  })
});

router.post('/update', isLoggedIn, function(req, res,next) {
  var data = req.body;
  product.update(data,function(err, result) {
    if (err) {
      res.sendStatus(500);
    } else {
      if (result.affectedRows>0) {
        res.send(true);
      }else{
        res.sendStatus(500);
      }
    }
  })

  
})

router.post('/update2', isLoggedIn, function(req, res,next) {
  var data = req.body;
  product.update2(data,function(err, result) {
    if (err) {
      res.sendStatus(500);
    } else {
      if (result.affectedRows>0) {
        res.send(true);
      }else{
        res.sendStatus(500);
      }
    }
  })

  
})



router.post('/createserial', isLoggedIn, function (req, res, next) {
  var datos = req.body;

  product.createserial(datos, function (error, data) {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  })
});

router.post('/createserialauto', isLoggedIn, function (req, res, next) {
  var datos = req.body;

  product.createserialauto(datos, function (error, data) {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  })
});

router.post('/delete', isLoggedIn, function (req, res, next) {
  var datos = req.body;

  product.delete(datos, function (error, data) {
    if (error) {
      res.sendStatus(500);
    } else {

      var changes = {
        table: 'PRODUCT',
        values: JSON.stringify(datos),
        user: req.session.usuarioDatos.name,
        ip: req.ip,
        type: 'DELETE'
      };

      event.create(changes, function (result) {
        console.log(result);
      });
      res.send(true);
    }
  })

})

router.post('/delete2', isLoggedIn, function (req, res, next) {
  var datos = req.body;

  product.delete2(datos, function (error, data) {
    if (error) {
      res.sendStatus(500);
    } else {

      var changes = {
        table: 'PRODUCT',
        values: JSON.stringify(datos),
        user: req.session.usuarioDatos.name,
        ip: req.ip,
        type: 'DELETE'
      };

      event.create(changes, function (result) {
        console.log(result);
      });
      res.send(true);
    }
  })

})

function isLoggedIn(req, res, next) {
  sess = req.session;
  if (sess.usuarioDatos)
    return next();
  sess.originalUrl = req.originalUrl;
  res.redirect('/login');
}

function isLoggedInAdmin(req, res, next) {
	sess = req.session;

	if (sess.adminDatos)
		return next();
	sess.originalUrl = req.originalUrl;
	res.redirect('/login');
}


module.exports = router;
