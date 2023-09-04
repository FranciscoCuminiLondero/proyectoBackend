const fs = require('fs');

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.carts = this.readCartsFromFile();
    }

    readCartsFromFile() {
        try {
            const fileContent = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(fileContent) || [];
        } catch (error) {
            console.error('Error reading carts from file:', error);
            return [];
        }
    }

    async saveCartsToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error('Error saving carts to file:', error);
        }
    }

    createCart() {
        const newCart = {
            id: this.generateUniqueId(),
            products: [],
        };

        this.carts.push(newCart);
        this.saveCartsToFile();

        return newCart.id;
    }

    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    addProductToCart(cartId, productId, quantity = 1) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            console.log('Carrito no encontrado');
            return;
        }

        const existingProductIndex = cart.products.findIndex(product => product.id === productId);

        if (existingProductIndex === -1) {
            cart.products.push({
                id: productId,
                quantity,
            });
        } else {
            cart.products[existingProductIndex].quantity += quantity;
        }

        this.saveCartsToFile();
    }

    removeProductFromCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            console.log('Carrito no encontrado');
            return;
        }

        const existingProductIndex = cart.products.findIndex(product => product.id === productId);

        if (existingProductIndex !== -1) {
            cart.products.splice(existingProductIndex, 1);
            this.saveCartsToFile();
        }
    }

    getProductsInCart(cartId) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            console.log('Carrito no encontrado');
            return [];
        }

        return cart.products;
    }

    generateUniqueId() {
        return Date.now().toString();
    }
}

module.exports = CartManager;
