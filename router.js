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
                  res.render('home', { items, categories, orders, users })
              })

            }
          })

        }
      })
    }

  })
})

// Show all items
router.get('/item', function(req, res) {
  Product.find({}).populate('category').exec((err, product) => {
    if(err)
      res.send('Xatolik yuz berdi')
    else
      res.render('item', { product })
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
  var newItem = new Product(req.body);
  newItem.save((err, product) => {
    if(err) {
      res.send(err)
    } else {
      res.redirect('/item')
    }
  })
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
  Product.findOneAndUpdate({ _id: req.params.id }, {$set: req.body}, function(err, result) {
    res.redirect(`/item/${req.params.id}`)
  })
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
  Category.create(req.body, function(err, product) {
    if(err) {
      res.send('Xatolik yuz berdi.')
    } else {
      res.redirect('/category')
    }
  })
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
  Category.findOneAndUpdate({ _id: req.params.id }, {$set: req.body}, function(err, result) {
    res.redirect('/category')
  })
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
router.get('/user', function(req, res) {
  User.find({}).exec(function(err, user) {
    if(err){
      res.send('Xatolik yuz berdi.')
    } else {
      res.render('users',{user})
    }
  })
})
// All orders
router.get('/order', function(req, res) {
  Order.find({}).sort({registration: 'desc'}).exec(function(err, order) {
    if(err){
      res.send('Xatolik yuz berdi.')
    } else {
      res.render('orders',{order, channel})
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
// Error handler
router.get('*', function(req, res) {  
    res.render('404');
});

module.exports = router