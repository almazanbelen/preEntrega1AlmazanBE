const express = require('express') 
const router = express.Router()
const fs = require('fs')

class Contenedor {
    constructor(file) {
        this.file = file
    }

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
const products = new Contenedor ("productos.json")


// //Endpoints

router.get("/product", async (req,res) =>{    
    const allObjects = await products.getAllObjects()
    console.log("Objetos guardados", allObjects)      
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
    res.json({message: "Producto agregado"})   
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