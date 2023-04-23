const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/User');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6441f7e5650dc7c90d1cb1fe')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB_CONNECT)
  // .then(()=>{
  //   return new User({
  //     name: 'John',
  //     email: 'john@test.com',
  //     cart: {
  //       items: []
  //     }
  //   }).save()
  // })
  .then(result=>{
    app.listen(3000);
    console.log('Connected!');
  })
  .catch(err=> console.log(err));