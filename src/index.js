const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 5000

app.use(express.json())

const Products = mongoose.model('Products', {
    id: Number,
    produto: String,
    acab: String,
    img_url: String,
})

app.get('/', async (req, res) => {

    const products = await Products.find()

    return res.send(products)
});



app.post("/cadastro", async (req, res) => {
    const products = new Products({
        id: req.body.id,
        produto: req.body.produto,
        acab: req.body.acab,
        img_url: req.body.img_url
    });

    await products.save();

    return res.send(products);

});


app.patch("/update/:id", async (req, res) => {

    const idFind = req.params.id

    const { id, produto, acab, img_url } = req.body;

    const products = {
        id,
        produto,
        acab,
        img_url,
    };

    try {

        const updateProduct = await Products.updateOne({ id: idFind }, products)

        if(updateProduct) {
            return res.status(200).json({message: "Atualizado!", products})
        }
        
        return res.status(200).json(products)

    } catch (err) {
        return res.status(500).json({ err, msg: "id não encontrado!" })
    }


})


app.delete("/:id", async (req, res) => {

    const products = await Products.findOneAndRemove().where({ id: req.params.id });

    if (!products) {
        return res.status(404).json("Produto não encontrado!")
    }

    return res.send(products);
})



app.listen(port, () => {
    mongoose.connect('mongodb+srv://jaimehansenfilho:jaime0hansen@apimongo.dkffyb5.mongodb.net/?retryWrites=true&w=majority')
    console.log("Server Up")
})
