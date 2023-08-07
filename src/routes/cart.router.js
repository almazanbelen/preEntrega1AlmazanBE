const express = require('express')
const fs = require('fs')
const router = express.Router()
//const allProducts = require("../../productos.json")

class Cart {
    constructor(file) {
        this.file = file
    }

    //metodos del file
    async save(obj){
        try{
            const objects = await this.getAllObjects()
            const lastId = objects.length > 0 ? objects[
                objects.length -1].id : 0
            const newId = lastId + 1
            const newObj = {id: newId, ...obj}
            objects.push(newObj)
            await this.saveObjects(objects)            
        }catch(error){
            throw new Error("Error al guardar el objeto")
        }
    }

    async getById(id){
        try{
            const objects = await this.getAllObjects()
            const obj = objects.find((o)=> o.id === id)
            return obj || null
        }catch(error){
            throw new Error("Error al obtener ID")
        }
    }
    
    async deleteById(id){
        try{
            let objects =await this.getAllObjects()
            objects = objects.filter((o)=> o.id !== id)
            await this.saveObjects(objects)
        }catch(error){
            throw new Error ("Error al eliminar los objetos")
        }
    }
    async getAllObjects(){
        try{
            const data = await fs.promises.readFile(this.file, "utf-8")
            return data ? JSON.parse(data) : []
        }catch(error){
           return []
        }
    }

    async saveObjects(objects){
        try{
            await fs.promises.writeFile(this.file, JSON.stringify(objects, null, 2))
        }catch(error){
            throw new Error("Error al guardar objetos")
        }
    }
}

//instanciar productos
const cart = new Cart ("cart.json")

//Endpoints

//ruta para obtener los carritos
router.get("/cart", async (req,res) =>{
    const allObjects = await cart.getAllObjects()     
    res.json(allObjects)
})

//ruta para crear un carrito
router.post("/cart", async (req,res) =>{
    const product = await cart.save(req.body)
    res.json({message: "Carrito agregado"})
    
})

//ruta para agregar un producto nuevo
router.post("/cart/:cid/product/:pid", async (req, res)=>{
    const {cid, pid} = req.params
 
})

//ruta para eliminar un producto
router.delete("/cart/:cid/product/:pid", async (req, res)=>{
    const {cid, pid} = req.params
    
})

module.exports = router