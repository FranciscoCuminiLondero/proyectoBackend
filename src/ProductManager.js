const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = this.readProductsFromFile();
    }

    readProductsFromFile() {
        try {
            const fileContent = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(fileContent) || [];
        } catch (error) {
            console.error('Error reading products from file:', error);
            return [];
        }
    }

    async saveProductsToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error saving products to file:', error);
        }
    }

    addProduct(title, description, price, code, stock, category, thumbnails = []) {
        if (!title || !description || !price || !code || stock === undefined || !category) {
            console.log('Todos los datos son obligatorios');
            return;
        }

        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            console.log('Ya existe un producto con el mismo código');
            return;
        }

        let newProduct = {
            id: this.generateUniqueId(),
            title,
            description,
            price,
            code,
            status: true,
            stock,
            category,
            thumbnails,
        };

        this.products.push(newProduct);
        this.saveProductsToFile();
    }

    getProducts(limit) {
        if (limit !== undefined && typeof limit !== 'number') {
            throw new Error('El límite debe ser un número válido');
        }

        let productsToReturn = this.products;

        if (limit !== undefined) {
            productsToReturn = this.products.slice(0, limit);
        }

        return productsToReturn;
    }

    getProductById(idProduct) {
        const product = this.products.find(product => product.id === idProduct);

        if (!product) {
            console.log('Producto no encontrado');
        }

        return product;
    }

    updateProduct(idProduct, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === idProduct);

        if (productIndex === -1) {
            console.log('Producto no encontrado');
            return;
        }

        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedFields,
            id: idProduct,
        };

        this.saveProductsToFile();
    }

    deleteProduct(idProduct) {
        const productIndex = this.products.findIndex(product => product.id === idProduct);

        if (productIndex === -1) {
            console.log('Producto no encontrado');
            return;
        }

        this.products.splice(productIndex, 1);
        this.saveProductsToFile();
    }

    generateUniqueId() {
        return Date.now().toString();
    }
}

module.exports = ProductManager;
