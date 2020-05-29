const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const dateFormat = require('dateformat')


const Product = require('./models/Product')
const Category = require('./models/Category')
const User = require('./models/User')
const Order = require('./models/Order')
var ObjectId = require('mongodb').ObjectID;

const channel = process.env.PRIVATECHANNEL

// Home page
router.get('/', function(req, res) {
  Product.find({}).populate('category').exec((err, product) => {
    var items = product.length
    if(err) {
      res.send('Xatolik yuz berdi')
    } else {
      Category.find({}).populate('category').exec((err, category) => {
        var categories = category.length
        if(err) {
          res.send('Xatolik yuz berdi')
        } else {
          Order.find({}).populate('category').exec((err, order) => {
            var orders = order.length
            if(err) {
              res.send('Xatolik yuz berdi')
            } else {
              User.find({}).populate('category').exec((err, user) => {
                // I know this s**t code, I am lazy to find another solution ))
                var users = user.length
                if(err)
                  res.send('Xatolik yuz berdi')
                else
                  res.render('home', { items, categories, orders, users, channel })
              })

            }
          })

        }
      })
    }

  })
})

// Show all items
router.get('/item', paginatedResultsusers(Product), function(req, res) {
  var limits = 10 // limit for items per page
  var product, previous, next
  if(res.paginatedResults.results) {
    product = res.paginatedResults.results
  }
  if(res.paginatedResults.previous) {
    previous = res.paginatedResults.previous
  }
  if(res.paginatedResults.next) {
    next = res.paginatedResults.next
  }
  var current = req.query.page
  var starting
  if(current > 1) {
    starting = (req.query.page-1) * req.query.limit + 1
  } else {
    starting = 1
  }
  var limit = req.query.limit
  Product.find({}).exec(function(err, users) {
    if(users) {
      var total = users.length
      var data = users.length / req.query.limit
      if (data === parseInt(data, 10)) {
        var lastpage = Math.floor(users.length / req.query.limit)
      } else { var lastpage = Math.floor(users.length / req.query.limit) + 1 }

      if(req.query.limit && req.query.page) {
        res.render('item',{product, previous, next, current, starting, limits, lastpage, limit, total})
      } else {
        res.redirect('item?page=1&limit=' + limits)
      }
    }
  })
})

// Show item by id
router.get('/item/:id', function(req, res) {
  Product.findOne({ _id: req.params.id }).populate('category').exec(function(err, product) {
    if(err) {
      res.send('Xatolik yuz berdi')
    } else {
      res.render('item-by-id',{product})
    }
  })
})

// Add new item
router.get('/new-item', function(req, res) {
  Category.find({}).exec(function(err, cat) {
    if(err){
      res.send('Xatolik yuz berdi.')
    } else {
      res.render('new-item',{cat})
    }
  })
})
router.post('/new-item', function(req, res) {
  /*
  var newItem = new Product(req.body);
  newItem.save((err, product) => {
    if(err) {
      res.send(err)
    } else {
      res.redirect('/item')
    }
  })
  */
   res.redirect(`/item`)
})

// Edit item
router.get('/edit/:id', function(req, res) {
  Product.findOne({ _id: req.params.id }).populate('category').exec(function(err, product) {
    if(err) {
      res.send('Xatolik yuz berdi')
    } else {
      res.render('edit',{product})
    }
  })
})
router.post('/edit/:id', function(req, res) {
  /*
  Product.findOneAndUpdate({ _id: req.params.id }, {$set: req.body}, function(err, result) {
    res.redirect(`/item/${req.params.id}`)
  })
  */
 res.redirect(`/item`)
})

// Delete item
/*
router.get('/delete/:id', function(req, res) {
  Product.findByIdAndRemove({_id: req.params.id}, function(err, result) {
    res.redirect('/item')
  })
})
*/
// Add category
router.get('/new-category', function(req, res) {
  res.render('new-category')
})

// Category
router.get('/category', function(req, res) {
  Category.find({}).exec(function(err, cat) {
    if(err){
      res.send('Xatolik yuz berdi.')
    } else {
      res.render('category',{cat})
    }
  })

})
router.post('/new-category', function(req, res) {
  /*
  Category.create(req.body, function(err, product) {
    if(err) {
      res.send('Xatolik yuz berdi.')
    } else {
      res.redirect('/category')
    }
  })
  */
 res.redirect(`/category`)
})
// Edit category
router.get('/edit-category/:id', function(req, res) {
  Category.findOne({ _id: req.params.id }).exec(function(err, cat) {
    if(err) {
      res.send('Xatolik yuz berdi')
    } else {
      res.render('edit-category',{cat})
    }
  })
})
router.post('/edit-category/:id', function(req, res) {
  /*
  Category.findOneAndUpdate({ _id: req.params.id }, {$set: req.body}, function(err, result) {
    res.redirect('/category')
  })
  */
 res.redirect(`/category`)
})

// Delete category
/*
router.get('/delete-category/:id', function(req, res) {
  Category.findByIdAndRemove({_id: req.params.id}, function(err, result) {
    res.redirect('/category')
  })
})
*/
// Show category by id
router.get('/category/:id', function(req, res) {
  Category.findOne({ _id: req.params.id }).exec(function(err, cat) {
    if(err) {
      res.send('Xatolik yuz berdi')
    } else {
      res.render('category-by-id',{cat})
    }
  })
})

// All users
router.get('/user', paginatedResultsusers(User), function(req, res) {
  var limits = 10 // limit for items per page
  var user, previous, next
  if(res.paginatedResults.results) {
    user = res.paginatedResults.results
  }
  if(res.paginatedResults.previous) {
    previous = res.paginatedResults.previous
  }
  if(res.paginatedResults.next) {
    next = res.paginatedResults.next
  }
  var current = req.query.page
  var starting
  if(current > 1) {
    starting = (req.query.page-1) * req.query.limit + 1
  } else {
    starting = 1
  }
  var limit = req.query.limit
  User.find({}).exec(function(err, users) {
    if(users) {
      var total = users.length
      var data = users.length / req.query.limit
      if (data === parseInt(data, 10)) {
        var lastpage = Math.floor(users.length / req.query.limit)
      } else { var lastpage = Math.floor(users.length / req.query.limit) + 1 }

      if(req.query.limit && req.query.page) {
        res.render('users',{user, previous, next, current, starting, limits, lastpage, limit, total})
      } else {
        res.redirect('user?page=1&limit=' + limits)
      }
    }
  })


})

router.get('/order/:id', function(req, res) {
  Order.findOne({ _id: req.params.id }).exec(function(err, cat) {
    if(err) {
      res.send('Xatolik yuz berdi')
    } else {
      var time = dateFormat(cat.registration, "HH:MM, d-mmm yyyy")
      res.render('order-by-id',{cat, time})
    }
  })
})
router.get('/edit-order/:id', function(req, res) {
  Order.findOne({ _id: req.params.id }).exec(function(err, product) {
    if(err) {
      res.send('Xatolik yuz berdi')
    } else {
      res.render('edit-order',{product})
    }
  })
})
router.post('/edit-order/:id', function(req, res) {
  Order.findOneAndUpdate({ _id: req.params.id }, {$set: req.body}, function(err, result) {
    res.redirect(`/order/${req.params.id}`)
  })
})

router.get('/orders', paginatedResults(Order), (req, res) => {
    
  var limits = 10 // limit for items per page
  // order items by orderdate
  const html = res.paginatedResults.results.map((f, i) => {
      var obj = {
          firstname: f.firstname,
          orderdate: f.orderdate,
          status: f.status,
          _id: f._id,
          orderid: f.orderid,
          registration: f.registration
      }
      return obj

  })
  /*
  html.sort(function(a, b){
    var aa = a.orderdate.split('.').reverse().join(),
        bb = b.orderdate.split('.').reverse().join();
    return aa < bb ? -1 : (aa > bb ? 1 : 0);
  });
  */
  var orders, previous, next
  if(res.paginatedResults.results) {
    orders = html
  }
  if(res.paginatedResults.previous) {
    previous = res.paginatedResults.previous
  }
  if(res.paginatedResults.next) {
    next = res.paginatedResults.next
  }
  var current = req.query.page
  var starting
  if(current > 1) {
    starting = (req.query.page-1) * req.query.limit + 1
  } else {
    starting = 1
  }
  var status;
  if(req.query.status) {
    status = req.query.status
  } else {
    status = 0 //all
  }
  var total = 0
  var limit = req.query.limit
  if(status == 1 || status == 2 || status == 3 || status == 4) {
    Order.find({status: status}).exec(function(err, result) {
      var all = result.length
      for(var i=0; i < result.length; i++) {
        total+=result[i].total
      }

      var data = result.length / req.query.limit
      if (data === parseInt(data, 10)) {
        var lastpage = Math.floor(result.length / req.query.limit)
      } else { var lastpage = Math.floor(result.length / req.query.limit) + 1 }

      if(result) {
        if(req.query.limit && req.query.page) {
          res.render('orders-page',{orders, previous, next, current, starting, limits, status, total, limit, lastpage, all})
        } else {
          res.redirect('orders?page=1&limit=' + limits + '&status=0')
        }
      }else {
        res.render(404)
      }
    })
  } else if(status == 0) {
    Order.find({}).exec(function(err, order) {
      var all = order.length
      for(var i=0; i < order.length; i++) {
        total+=order[i].total
      }
      var data = order.length / req.query.limit

      if (data === parseInt(data, 10)) {
        var lastpage = Math.floor(order.length / req.query.limit)
      } else { var lastpage = Math.floor(order.length / req.query.limit) + 1 }

      if(order) {
        if(req.query.limit && req.query.page) {
          res.render('orders-page',{orders, previous, next, current, starting, channel, limits, status, total, limit, lastpage, all})
        } else {
          res.redirect('orders?page=1&limit=' + limits + '&status=0')
        }
      }else {
        res.render(404)
      }
    })
  }
  

  

})

//functions

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const status = parseInt(req.query.status)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}
    if(req.query.status == 1 || req.query.status == 2 || req.query.status == 3|| req.query.status == 4) {
      if (endIndex < await model.find({status: status}).countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
    }
    if(req.query.status == 0){
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
    }
    
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      if(status) {
        results.results = await model.find({status: status}).limit(limit).skip(startIndex).exec()
      }else {
        results.results = await model.find().limit(limit).skip(startIndex).exec()
      }

      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}

function paginatedResultsusers(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const status = parseInt(req.query.status)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}
    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec()

      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}
// Error handler
router.get('*', function(req, res) {  
  res.render('404');
});

module.exports = router