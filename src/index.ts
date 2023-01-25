import { products, purchase, users } from "./database";
import { DProduct, DUser, DPurchase, Categoria } from "./types";

import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from "./database/knex";

const app = express()

app.use(express.json());
app.use(cors());

app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001')
})

app.get('/Ping', (req: Request, res: Response) => {
    res.send('Pong')
})

/////////////////////////////////////////// REQUISIÇÕES

app.get('/users', async (req: Request, res: Response) => {
    try {
        //res.send(users)

        const usersData = await db.raw(`
            SELECT * FROM users;
        `
        )

        res.status(200).send(usersData)

    } catch (error: any) {
        if (res.status(500)) {
            res.status(200)
        }
        res.status(400).send(error.message)
    }
})

/////////////////////////////////////////////////////
app.get('/products', async (req: Request, res: Response) => {
    try {

        const productsData = await db.raw(`
            SELECT * FROM products;
        `)

        res.status(200).send(productsData)

    } catch (error: any) {
        if (res.status(500)) {
            res.status(200)
        }
        res.status(400).send(error.message)
    }
})

/////////////////////////////////////////////////////
app.get('/purchases', async (req: Request, res: Response) => {
    try {

        const purchasesData = await db.raw(`
            SELECT * FROM purchases;
        `)

        res.status(200).send(purchasesData)

    } catch (error: any) {
        if (res.status(500)) {
            res.status(200)
        }
        res.status(400).send(error.message)
    }
})

///////////////////////////////////////////////////////////////////////
app.get('/products/search', async (req: Request, res: Response) => {


    const q = req.query.q as string

    const productFilter = await db.raw(`
        SELECT * FROM products 
        WHERE name = "${q}"
    `)

    if (q.length < 1) {
        res.status(400).send('Insira o nome do produto!')
    }

    if (productFilter.length === 0) {
        res.status(400).send('Produto não encontrado')
    }

    res.status(200).send(productFilter)
})

////////////////////////////////////////////////////
app.post('/users', async (req: Request, res: Response) => {

    try {
        const id = req.body.id
        const email = req.body.email
        const password = req.body.password;

        if (!id && !email && !password) {
            res.status(400).send('Você não inseriu nenhuma informação!')
        }

        if (!id) {
            res.status(400).send('Você não inseriu a "Id"!')
        }

        if (!email) {
            res.status(400).send('Você não inseriu um "Email"!')
        }

        if (!password) {
            res.status(400).send('Você não inseriu a "Password"!')
        }

        await db.raw(`
            INSERT INTO users (id, email, password)
            VALUES("${id}", "${email}", "${password}");
        `)

        res.status(201).send('Usuário criado com sucesso')

    } catch (error: any) {
        if (res.statusCode === 500) {
            res.status(400)
        }
        res.status(400).send(error.message)
    }
})
////////////////////////////////////////////////////

////////////////////////////////////////////////////
app.post('/products', async (req: Request, res: Response) => {

    try {
        const id = req.body.id
        const name = req.body.name
        const price = req.body.price;
        const description = req.body.description;
        const imgUrl = req.body.imgUrl

        if (!id && !name && !price && !description && imgUrl) {
            res.status(400).send('Você não inseriu nenhuma informação!')
        }

        if (!id) {
            res.status(400).send('Você não inseriu a "Id"!')
        }

        if (!name) {
            res.status(400).send('Você não inseriu um "Nome"!')
        }

        if (!price) {
            res.status(400).send('Você não inseriu o "Preço" do produto!')
        }

        if (!description) {
            res.status(400).send('Você não inseriu a "Descrição" do produto!')
        }

        if (!imgUrl) {
            res.status(400).send('Você não inseriu a "Imagem" do produto!')
        }

        await db.raw(`
            INSERT INTO products(id, name, price, description, imgUrl)
            VALUES("${id}", "${name}", "${price}", "${description}", "${imgUrl}");
        `)

        res.status(201).send('Produto criado com sucesso')

    } catch (error: any) {
        if (res.statusCode === 500) {
            res.status(400)
        }
        res.status(400).send(error.message)
    }
})

///////////////////////////////////////////////////////
app.post('/purchases', async (req: Request, res: Response) => {

    try {

        const id = req.body.userId
        const buyerId = req.body.buyerId
        const totalPrice = req.body.totalPrice
        const deliveredAt = req.body.delivered_At
        const paid = req.body.paid;

        await db.raw(`
            INSERT INTO purchases(id, total_price, paid, delivered_at, buyer_id)
            VALUES('${id}', '${totalPrice}', ${paid}, '${deliveredAt}', '${buyerId}');
        `)

        res.status(201).send('Compras efetuadas com sucesso')

    } catch (error: any) {
        if (res.statusCode === 500) {
            res.status(400)
        }
        res.status(400).send(error.message)
    }
})
////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
app.get('/products/:id', async (req: Request, res: Response) => {

    try {
        const id = req.params.id;

        const productById = await db.raw(`
            SELECT * FROM products
            WHERE id = ${id}
        `)

        res.status(200).send(productById)
    } catch (error: any) {
        if (res.statusCode === 500) {
            res.status(400)
        }
        res.status(400).send(error.message)
    }
})
////////////////////////////////////////////////////////////////

app.get('/users/:id/purchases', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const purchasesByUserId = await db.raw(`
            SELECT * FROM purchases
            WHERE buyer_id = "${id}"
        `)

        res.status(200).send(purchasesByUserId)
    } catch (error: any) {
        if (res.statusCode === 500) {
            res.status(400)
        }
        res.status(400).send(error.message)
    }
})

app.delete('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const userId = users.findIndex((user) => {
        return user.id === id
    })

    users.splice(userId, 1)

    res.status(200).send('Usuário deletado com sucesso')
})

app.delete('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const productId = products.findIndex((product) => {
        return product.id === id
    })

    products.splice(productId, 1)

    res.status(200).send('Produto deletado com sucesso')
})

app.put('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const newEmail = req.body.email as string | undefined
    const newPassword = req.body.password

    const user = users.find((user) => user.id === id)

    if (user) {
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

    const productEdited = products.find((product) => product.id === id)

    if (productEdited) {
        productEdited.name = newName || productEdited.name
        productEdited.category = newCategory || productEdited.category

        productEdited.price = isNaN(newPrice) ? productEdited.price : newPrice
    }

    res.status(200).send('Atualização realizada com sucesso')
})