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
    try {
        res.send(users)
    } catch (error:any) {
        if(res.status(500)){
            res.status(200)
        }
        res.status(400).send(error.message)
    }
})

/////////////////////////////////////////////////////
app.get('/products',(req: Request, res: Response)=>{
    try {
        res.send(products)
    } catch (error: any) {
        if(res.status(500)){
            res.status(200)
        }
        res.status(400).send(error.message)
    }
})
/////////////////////////////////////////////////////

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

////////////////////////////////////////////////////
app.post('/users', (req: Request, res: Response)=>{

    try {
        const id = req.body.id
        const email = req.body.email
        const password = req.body.password;

        const newUser:DUser = {
            id: id,
            email: email,
            password: password
        }

        const idFilter = users.filter((user)=>{
            return user.id === id
        })

        const emailFilter = users.filter((user)=>{
            return user.email === email
        })
        
        if(idFilter.length > 0){
            res.statusCode = 400
            throw new Error('Esse Id já está em uso!')
        }else if(emailFilter.length > 0){
            res.statusCode = 400
            throw new Error('Esse Email já está em uso!')
        } else{
            users.push(newUser);
        }

        res.status(201).send('Usuário criado com sucesso')

    } catch (error: any) {
        if(res.statusCode === 500){
            res.status(400)
        }
        res.status(400).send(error.message)
    }
})
////////////////////////////////////////////////////

////////////////////////////////////////////////////
app.post('/products', (req: Request, res: Response)=>{

    try {
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

        const idFilter = products.filter((product)=>{
            return product.id === id
        })

        if(idFilter.length > 0){
            res.statusCode = 400
            throw new Error('Esse Id já está em uso!')
        }else{
            products.push(newProduct);
        }
        res.status(201).send('Produto criado com sucesso')

    } catch (error: any) {
        if(res.statusCode === 500){
            res.status(400)
        }
        res.status(400).send(error.message)
    }
})
///////////////////////////////////////////////////////
app.post('/purchase', (req: Request, res: Response)=>{
    
    try {

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
        
        const idUser = users.find((user) => user.id === userId)
        const idProduct = products.find((product) => product.id === productId)
        const indexProduct = products.findIndex((product)=>product.id === productId)

        if(!idUser){
            res.statusCode = 400
            throw new Error('Id de usuário não encontrado')
        }else if(!idProduct){
            res.statusCode = 400
            throw new Error('Id de produto não encontrado')
        }else if(totalPrice !== products[indexProduct].price * quantity){
            res.statusCode = 400
            throw new Error('Valor total inválido!')
        }
        else{
            purchase.push(newPurchase);
        }        

        res.status(201).send('Compras efetuadas com sucesso')   

    } catch (error: any) {
        if(res.statusCode === 500){
            res.status(400)
        }
        res.status(400).send(error.message)
    }
})
////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
app.get('/products/name', (req: Request, res: Response) => {
    try {
        const q = req.query.q;

        if(q === undefined){
            throw new Error('Coloque ao menos um caractere')
        }

        const productsName = products.find((product) => product.name === q)

        res.status(200).send(productsName)
    } catch (error) {
        if(res.status(500)){
            res.status(200)
        }
        res.send(error)
    }
})
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
app.get('/products/:id', (req: Request, res: Response) => {
    
    const id = req.params.id;

        const productsId = products.find((product) => product.id === id)

    res.status(200).send(id)
})
////////////////////////////////////////////////////////////////

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