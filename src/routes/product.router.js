const express = require('express')
const router = express.Router()
const fs = require('fs')
const Contenedor = require("../contenedor/classContainer")



//instanciar productos
const products = new Contenedor ("product.json")


// //Endpoints

router.get("/product", async (req,res) =>{    
    const allObjects = await products.getAllObjects()    
    res.json(allObjects)
})

//ruta para obtener un producto por ID
router.get('/product/:pid', async (req,res)=>{
    const pid = Number(req.params.pid)  
    const obj = await products.getById(pid)
    return res.json(obj)
})

//ruta para agregar un producto
router.post("/product", async (req, res)=>{
    const product = await products.save(req.body)        
    res.send(product)
})

//ruta para actualizar un producto por ID
router.put('/product/:pid', async (req,res)=>{   
    const pid = parseInt(req.params.pid);
    const updateFields = req.body;
    

    // Validamos que se proporcionen campos para actualizar
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar.' });
    }   
     
    const obj = await products.getById(pid)

    if (obj === -1) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    products[obj] = {
        ...products[obj],
        ...updateFields
    };   

    return res.json(products[obj]);
    
})

//ruta para eliminar un producto por su ID
router.delete('/product/:pid', async(req, res) => {
    const pid = parseInt(req.params.pid)
    await products.deleteById(pid)    
    res.send("Objeto eliminado")   
});

module.exports = router