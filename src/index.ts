import { products, purchase, users } from "./database";
import { DProduct, DUser, DPurchase, Categoria } from "./types";

import express, {Request, Response} from 'express'
import cors from 'cors'

const app = express()

app.use(express.json());
app.use(cors());

app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001')
})

app.get('/Ping',(req: Request, res: Response)=>{
    res.send('Pong')
})

app.get('/users',(req: Request, res: Response)=>{
    res.send(users)
})

app.get('/products',(req: Request, res: Response)=>{
    res.send(products)
})

app.get('/purchase',(req: Request, res: Response)=>{
    res.status(200).send(purchase)
})

app.get('/products',( req: Request, res: Response)=>{

    const q = req.query.q as string

    const productFilter = products.filter((product)=>{
        return product.name.toLowerCase().includes(q.toLowerCase())
    })

    res.send(productFilter)
})

app.post('/users', (req: Request, res: Response)=>{
    const id = req.body.id
    const email = req.body.email
    const password = req.body.password;

    const newUser:DUser = {
        id: id,
        email: email,
        password: password
    }

    users.push(newUser);

    res.status(201).send('Usuário criado com sucesso')
})

app.post('/products', (req: Request, res: Response)=>{
    const id = req.body.id
    const name = req.body.name
    const price = req.body.price;
    const category = req.body.category;

    const newProduct:DProduct = {
        id: id,
        name: name,
        price: price,
        category: category
    }

    products.push(newProduct);

    res.status(201).send('Produto criado com sucesso')
})

app.post('/purchase', (req: Request, res: Response)=>{
    const userId = req.body.userId
    const productId = req.body.productId
    const quantity = req.body.quantity;
    const totalPrice = req.body.totalPrice;

    const newPurchase:DPurchase = {
        userId,
        productId,
        quantity,
        totalPrice
    }

    purchase.push(newPurchase);

    res.status(201).send('Compras efetuadas com sucesso')
})

app.get('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const productsId = products.find((product) => product.id === id)

    res.status(200).send(productsId)
})


app.get('/users/:id/purchase', (req: Request, res: Response) => {
    const id = req.params.id;

    const purchaseUserId = purchase.find((purch) => purch.userId === id)

    res.status(200).send(purchaseUserId)
})

app.delete('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const userId = users.findIndex((user)=>{
        return user.id === id
    })

    users.splice(userId, 1)

    res.status(200).send('Usuário deletado com sucesso')
})

app.delete('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const productId = products.findIndex((product)=>{
        return product.id === id
    })

    products.splice(productId, 1)

    res.status(200).send('Produto deletado com sucesso')
})

app.put('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const newEmail = req.body.email as string | undefined
    const newPassword = req.body.password

    const user = users.find((user)=>user.id === id)

    if(user){
        user.email = newEmail || user.email
        user.password = newPassword || user.password
    }

    res.status(200).send('Atualização realizada com sucesso')
})

app.put('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number
    const newCategory = req.body.category as Categoria | undefined

    const productEdited = products.find((product)=>product.id === id)

    if(productEdited){
        productEdited.name = newName || productEdited.name
        productEdited.category = newCategory || productEdited.category

        productEdited.price = isNaN(newPrice) ? productEdited.price : newPrice
    }

    res.status(200).send('Atualização realizada com sucesso')
})