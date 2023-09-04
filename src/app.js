const express = require('express');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

const app = express();
const port = 8080;

const productManager = new ProductManager('productos.json');
const cartManager = new CartManager('carrito.json');

app.use(express.json());

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
    res.send('¡Bienvenido!');
});

// Rutas para gestionar productos
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    if (!productId) {
        res.status(400).json({ error: 'ID de producto inválido' });
        return;
    }

    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

app.post('/products', (req, res) => {
    const { title, description, price, code, stock, category, thumbnails } = req.body;
    productManager.addProduct(title, description, price, code, stock, category, thumbnails);
    res.json({ message: 'Producto agregado correctamente' });
});

app.put('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    if (!productId) {
        res.status(400).json({ error: 'ID de producto inválido' });
        return;
    }

    const updatedFields = req.body;
    productManager.updateProduct(productId, updatedFields);
    res.json({ message: 'Producto actualizado correctamente' });
});

app.delete('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    if (!productId) {
        res.status(400).json({ error: 'ID de producto inválido' });
        return;
    }

    productManager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado correctamente' });
});

// Rutas para gestionar carritos de compra
app.post('/carts', (req, res) => {
    const cartId = cartManager.createCart();
    res.json({ cartId });
});

app.post('/carts/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;

    cartManager.addProductToCart(cartId, productId, quantity);
    res.json({ message: 'Producto agregado al carrito' });
});

app.get('/carts/:cid', (req, res) => {
    const cartId = req.params.cid;
    const cart = cartManager.getCartById(cartId);
    if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
    }
    res.json(cart);
});


app.listen(port, () => {
    console.log(`Servidor Express en ejecución en http://localhost:${port}`);
});
