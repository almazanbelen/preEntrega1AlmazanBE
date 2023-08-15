const fs = require('fs').promises

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
    async putById (id, title, description, code, price, status, stock, category){
        try{
            const objects = await this.getAll()
            const foundById = objects.find((obj)=> obj.id === id)
            
            title ? foundById.title = title : foundById.title 
            description ? foundById.description = description : foundById.description 
            code ? foundById.code = code : foundById.code 
            price ? foundById.price = price : foundById.price 
            status ? foundById.status = status : foundById.status 
            stock ? foundById.stock = stock : foundById.stock 
            category ? foundById.category = category : foundById.category 
            

            console.log(foundById)
           
            await this.saveObjects(objects)
            return 'Producto modificado: \n' + foundById.title 
        }
        catch (error){
            return error
        }
    }

    async saveObjects(objects){
        try{
            await fs.promises.writeFile(this.file, JSON.stringify(objects, null, 2))
        }catch(error){
            throw new Error("Error al guardar objetos")
        }
    }

    //----Metodos del Cart-----

    async getAllCart(){
        try{
            const data = await fs.promises.readFile(this.file, "utf-8")
            return data ? JSON.parse(data) : []
        }catch(error){
           return []
        }
    }

    async addProductToCart(){
        try{
            const products = await this.getAllObjects();
            const cart = await this.getAllCart();
            const verifProduct = products.some((e)=> e.id === pid);
            if(!verifProduct){
                return 'El producto o el carrito con el ID indicado no existe. Pruebe con otros valores.'
            }
            if(cart.products.some((e)=> e.id === pid)){
                const product = cart.products.find((e)=> e.id === pid)
                product.quantity ++
                await fs.writeFile(this.file, JSON.stringify(cart, null, 2))
                return 'El carrito sumó una unidad más del producto con el ID: ' + pid;
            } else{
                cart.products.push({
                    id: pid,
                    quantity: 1
                })
                await fs.writeFile(this.file, JSON.stringify(cart, null, 2))
                return 'El carrito sumó a la lista el producto con el ID: ' + pid;
            }
           
        }catch (error){
            console.log('Error al agregar producto');
        }
    }
}
module.exports = Contenedor;