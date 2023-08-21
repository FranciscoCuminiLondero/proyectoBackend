const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

const productManager = new ProductManager('productos.json');

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi servidor Express!');
});

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

app.listen(port, () => {
    console.log(`Servidor Express en ejecución en http://localhost:${port}`);
});
