const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');

// Associations

// Un user are multe cart items
User.hasMany(Cart, {
  foreignKey: 'userId',
});

// Fiecare item din coș aparține unui user
Cart.belongsTo(User, {
  foreignKey: 'userId',
});

// Un produs poate fi în multe cart items
Product.hasMany(Cart, {
  foreignKey: 'productId',
});

// Fiecare cart item are un singur produs
Cart.belongsTo(Product, {
  foreignKey: 'productId',
});

module.exports = { User, Product, Cart };
