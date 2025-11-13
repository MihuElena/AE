const express = require('express');
const { Cart, Product } = require('../database/models');
const { verifyToken } = require('../utils/token.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

// helper: scoatem userId din tokenul trimis în header
function getUserIdFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return null;

  const scheme = parts[0];
  const token = parts[1];

  if (scheme !== 'Bearer') return null;

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET); // la login semnezi { id, role }
    return payload.id || null;
  } catch (err) {
    console.error('JWT verify error:', err.message);
    return null;
  }
}

/**
 * POST /cart
 * Adaugă un produs în coșul user-ului logat
 * body: { productId, quantity }
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    

    console.log('POST /cart CALL:', { userId, productId, quantity }); // 👈

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
        data: {},
      });
    }
    // ... restul codului tău

// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const userId = getUserIdFromRequest(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: 'Not authorized',
//         data: {},
//       });
//     }

    const { productId, quantity = 1 } = req.body;

    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'productId is not valid',
        data: {},
      });
    }

    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number',
        data: {},
      });
    }

    // verificăm dacă produsul există
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        data: {},
      });
    }

    // verificăm dacă există deja itemul în coș
    const existingItem = await Cart.findOne({
      where: { userId, productId },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await existingItem.update({
        quantity: existingItem.quantity + Number(quantity),
      });
    } else {
      cartItem = await Cart.create({
        userId,
        productId,
        quantity,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      data: error.message,
    });
  }
});

/**
 * PUT /cart/:id
 * Updatează cantitatea unui item din coș
 * body: { quantity }
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
        data: {},
      });
    }

    const id = req.params.id;
    const { quantity } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cart item id is not valid',
        data: {},
      });
    }

    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number',
        data: {},
      });
    }

    const cartItem = await Cart.findOne({
      where: { id, userId },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
        data: {},
      });
    }

    const updatedItem = await cartItem.update({ quantity });

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      data: error.message,
    });
  }
});

/**
 * DELETE /cart/:id
 * Șterge un item din coșul user-ului logat
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
        data: {},
      });
    }

    const id = req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cart item id is not valid',
        data: {},
      });
    }

    const cartItem = await Cart.findOne({
      where: { id, userId },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
        data: {},
      });
    }

    await cartItem.destroy();

    res.status(200).json({
      success: true,
      message: 'Cart item successfully deleted',
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting cart item',
      data: error.message,
    });
  }
});

/**
 * DELETE /cart
 * Golește complet coșul user-ului logat
 */
router.delete('/', verifyToken, async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
        data: {},
      });
    }

    await Cart.destroy({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      data: error.message,
    });
  }
});

/**
 * GET /cart
 * Returnează toate produsele din coșul user-ului logat
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    console.log('GET /cart for userId:', userId);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
        data: {},
      });
    }

    const items = await Cart.findAll({
      where: { userId },
      include: [Product], // opțional: info produs
    });

    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving cart',
      data: error.message,
    });
  }
});

/**
 * GET /cart/:id
 * Returnează un singur item din coș (al user-ului logat)
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
        data: {},
      });
    }

    const id = req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cart item id is not valid',
        data: {},
      });
    }

    const cartItem = await Cart.findOne({
      where: { id, userId },
      include: [Product],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart item retrieved successfully',
      data: cartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving cart item',
      data: error.message,
    });
  }
});

module.exports = router;
