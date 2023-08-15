const express = require('express')
const fs = require('fs')
const router = express.Router()
const constProd = require("../routes/product.router")
const Contenedor = require('../contenedor/classContainer')

const allProducts = constProd.products

//
//instanciar carrito
const cart = new Contenedor ("cart.json")

//class productos
class ProductContainter{
    constructor(file) {
        this.file = file
    }

    async getAllProducts(){
        try{
            const data = await fs.promises.readFile(this.file, "utf-8")
            return data ? JSON.parse(data) : []
        }catch(error){
            return []
        }
    }
    async getProdById(id){
        try{
            const objects = await this.getAllProducts()
            const obj = objects.find((o)=> o.id === id)
            return obj || null
        }catch(error){
            throw new Error("Error al obtener ID")
        }
    }
   async deleteProdById(id){
    try{
        let objects =await this.getAllProducts()
        objects = objects.filter((o)=> o.id !== id)
        await this.saveProducts(objects)
    }catch(error){
        throw new Error ("Error al eliminar los objetos")
        }
   
    }

    async saveProducts(objects){
        try{
            await fs.promises.writeFile(this.file, JSON.stringify(objects, null, 2))
        }catch(error){
            throw new Error("Error al guardar objetos")
        }
    }
 }

 //instanciar producto
 const newProduct = new ProductContainter (allProducts)


//Endpoints

//ruta para obtener los carritos
router.get("/cart", async (req,res) =>{
    const allCarts = await cart.getAllObjects()      
    res.json(allCarts)
   
})

//ruta para agregar un producto nuevo
router.post("/cart/product/:pid", async (req, res)=>{
    const pid = Number(req.params)
    const addProduct = await newProduct.getProdById(pid)
    const cartItems = await cart.getAllObjects()
    
    if (addProduct) {
        cartItems.push(addProduct.id, addProduct.title)
        await cart.saveObjects(addProduct)

        res.json({ message: 'Producto añadido al carrito.' });
    } else {
        res.status(404).json({ message: 'Producto no encontrado.' });
    }
 
})

//ruta para eliminar un producto
router.delete("/cart/product/:pid", async (req, res)=>{    
    const pid = parseInt(req.params.pid)
    await cart.deleteById(pid)    
    res.send("Objeto eliminado")
})

module.exports = router