const express = require('express')

const router = express.Router()

const cart = []

//Endpoints
//ruta para obtener todos los productos
router.get("/cart", (req,res) =>{
    res.json({cart})
})


//ruta para agregar un producto nuevo
router.post("/cart", (req, res)=>{
    const newCart = req.body
    cart.push(newCart)
    res.json({message: "producto agregado"})
})


module.exports = router