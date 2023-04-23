const mongoose = require('mongoose');
const Product = require('./product');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});


userSchema.methods.addToCart = function(product){
    const cartProductArr = this.cart.items;
    const cartProductIndex = cartProductArr.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteProductId = function (prodId){
    const cartProductArr = this.cart.items;
    const updatedCart = cartProductArr.filter(cp => {
      return cp.productId.toString() !== prodId.toString();
    });
    this.cart.items = updatedCart;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
  };

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class User {
//   constructor(name, email, mobile, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.mobile = mobile;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save(){
//     const db = getDb();
//     dbOp = db.collection('users').insertOne(this);
//     return dbOp.then((result) => {
//       console.log(result);
//     }).catch((err) => {
//       console.log(err);
//     });
//   }

//   addToCart(product) {
//     const cartProductArr = this.cart.items;
//     console.log('thisssss',this);
//     console.log(cartProductArr);
//     const cartProductIndex = cartProductArr.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems
//     };
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           };
//         });
//       });
//   }

//   deleteProductId(prodId) {
//     const db = getDb();
//     const cartProductArr = this.cart.items;
//     const cartProductIndex = cartProductArr.findIndex(cp => {
//       return cp.productId.toString() === prodId.toString();
//     });
//     cartProductArr.splice(cartProductIndex,1);
//     const updatedCart = {
//       items: cartProductArr
//     }
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name
//           }
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//     .collection('orders')
//     .find({ 'user._id': new mongodb.ObjectId(this._id)})
//     .toArray();
//   }

//   static findUserById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .find({ _id: new mongodb.ObjectId(userId) })
//       .next()
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static findAllUser() {
//     const db = getDb();
//     return db
//       .collection('users')
//       .find()
//       .toArray()
//       .then(users => {
//         console.log(users);
//         return users;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static deleteById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .deleteOne({ _id: new mongodb.ObjectId(userId) })
//       .then(result => {
//         console.log('Deleted', result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }
// module.exports = User;