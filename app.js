const express = require('express')
const path = require('path')

const cartRouter = require("./src/routes/cart.router")
const productRouter = require("./src/routes/product.router")

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Agregar path public
app.use(express.static(path.join(__dirname, 'public')))

//Routing

app.use("/", cartRouter)
app.use("/", productRouter.router)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"src/public","index.html"))
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})