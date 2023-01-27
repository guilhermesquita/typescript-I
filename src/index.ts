import { products, purchase, users } from "./database";
import { DProduct, DUser, DPurchase, Categoria } from "./types";

import express, { query, Request, Response } from 'express'
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

/////////////////////////////////////////// REQUISIÇÕES [endpoints]

//////////////////////GET

//getAllUsers
app.get('/users', async (req: Request, res: Response) => {
    try {

        const usersData = await db.select('*').from('users')

        res.status(200).send(usersData)

    } catch (error: any) {
        if (res.status(500)) {
            res.status(200)
        }
        res.status(400).send(error.message)
    }
})

/////////////////////////////////////////////////////getAllProducts
app.get('/products', async (req: Request, res: Response) => {
    try {

        const productsData = await db('products').select('*')

        res.status(200).send(productsData)

    } catch (error: any) {
        if (res.status(500)) {
            res.status(200)
        }
        res.status(400).send(error.message)
    }
})

/////////////////////////////////////////////////////getAllPurchases
app.get('/purchases', async (req: Request, res: Response) => {
    try {

        const purchasesData = await db('purchases').select('*')

        res.status(200).send(purchasesData)

    } catch (error: any) {
        if (res.status(500)) {
            res.status(200)
        }
        res.status(400).send(error.message)
    }
})

//////////////////////////////////////////////////getPurchasesById
app.get('/purchases/:id', async (req: Request, res: Response) => {
    try {

        const idPurchase = req.params.id;

        const [purchasesData] = await db('purchases').where({ id: idPurchase });

        res.status(200).send(purchasesData)

    } catch (error: any) {
        if (res.status(500)) {
            res.status(200)
        }
        res.status(400).send(error.message)
    }
})

////////////////////////EM MANUNTENÇÃO
// app.get('/list/', async (req: Request, res: Response) => {
//     try {

//         const idPurchase = req.params.id;

//         const [purchases_products] = await db('purchases_products')
//         .select( 'purchases.id'
//         ).innerJoin('purchases', 
//         'purchases_products.purchase_id', '=', 'purchases.id')
//         .innerJoin('users', 'purchases_buyer', '=', 'users.id');

//         res.status(200).send(purchases_products)

//     } catch (error: any) {
//         if (res.status(500)) {
//             res.status(200)
//         }
//         res.status(400).send(error.message)
//     }
// })

/////////////////////////////////////////////////getPurchaseByIdUsers
app.get('/users/:id/purchases', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const purchasesByUserId = await db.raw(`
            SELECT * FROM purchases
            WHERE buyer = "${id}"
        `);

        res.status(200).send(purchasesByUserId);
    } catch (error: any) {
        if (res.statusCode === 500) {
            res.status(400)
        }
        res.status(400).send(error.message)
    }
})

////////////////////////////////////////////////////////////////GetProductsByName
app.get('/products/search', async (req: Request, res: Response) => {

    const q = req.query.q as string

    const productFilter = await db('products').where("name", "LIKE", `%${q}%`)

    if (q.length < 1) {
        res.status(400).send('Insira o nome do produto!')
    }

    if (productFilter.length === 0) {
        res.status(400).send('Produto não encontrado')
    }

    res.status(200).send(productFilter)
})

//////////////////////getProductsById
app.get('/products/:id', async (req: Request, res: Response) => {

    try {
        const id = req.params.id;

        const productById = await db.raw(`
            SELECT * FROM products
            WHERE id = "${id}"
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


///////////////////POST//////////////////



////////////////////////////////////////////////////creatUser
app.post('/users', async (req: Request, res: Response) => {

    try {
        const { id, name, email, password } = req.body

        const validacaoId = await db('users').select('*').where({ id: id })

        if (validacaoId.length > 0) {
            res.status(400).send('Id já existente!')
        }

        const validacaoEmail = await db('users').select('*').where({ email: email })

        if (validacaoEmail.length > 0) {
            res.status(400).send('Email já cadastrado!')
        }

        if (!id && !email && !password && !name) {
            res.status(400).send('Você não inseriu nenhuma informação!')
        }

        if (!id) {
            res.status(400).send('Você não inseriu a "Id"!')
        }

        if (!name) {
            res.status(400).send('Você não inseriu um "Nome"!')
        }

        if (!email) {
            res.status(400).send('Você não inseriu um "Email"!')
        }

        if (!password) {
            res.status(400).send('Você não inseriu a "Password"!')
        }

        await db.raw(`
            INSERT INTO users (id, name, email, password)
            VALUES("${id}", "${name}","${email}", "${password}");
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

////////////////////////////////////////////////////creatProduct
app.post('/products', async (req: Request, res: Response) => {

    try {
        const id = req.body.id
        const name = req.body.name
        const price = req.body.price;
        const description = req.body.description;
        const imgUrl = req.body.imgUrl

        const validacaoId = await db('products').select('*').where({ id: id })

        if (validacaoId.length > 0) {
            res.status(400).send('Id já existente!')
        }

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

///////////////////////////////////////////////////////creatPurchase
app.post('/purchases', async (req: Request, res: Response) => {

    try {

        const id = req.body.userId
        const buyerId = req.body.buyerId
        const totalPrice = req.body.totalPrice
        const deliveredAt = req.body.delivered_At
        const paid = req.body.paid;

        const validacaoId = await db('purchases').select('*').where({ id: id })

        if (validacaoId.length > 0) {
            res.status(400).send('Id já existente!')
        }

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
////////////////////////////////////////////////////////////

/////////////PUT////////////////

///////////////////editUserById                            
app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const newEmail = req.body.email as string | undefined
        const newPassword = req.body.password

        if (newEmail !== undefined) {

            if (typeof newEmail !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

            if (newEmail.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        if (newPassword !== undefined) {

            if (typeof newPassword !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

            if (newPassword.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        const [user] = await db("users").where({ id: id })

        if (user) {
            const updatedUser = {
                email: newEmail || user.id,
                password: newPassword || user.name,
            }

            await db("users").update(updatedUser).where({ id: id })
        } else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }


        res.status(200).send('Atualização realizada com sucesso')
    } catch (error: any) {
        if (res.statusCode === 500) {
            res.status(400)
        }
        res.status(400).send(error.message)
    }
})

///////////////////editProductById
app.put('/products/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number
    const newDescription = req.body.description as string | undefined
    const newImg = req.body.imgUrl as string | undefined

    const [product] = await db("products").where({ id: id })

    if (product) {
        const updatedProduct = {
            name: newName || product.name,
            price: isNaN(newPrice) ? product.price : newPrice,
            description: newDescription || product.description,
            imgUrl: newImg || product.imgUrl
        }

        await db("products").update(updatedProduct).where({ id: id })
    } else {
        res.status(404).send('Id não encontrada')
        throw new Error("'id' não encontrada")
    }

    res.status(200).send('Atualização realizada com sucesso')
})

////////////////////////////////////////////////////////////////

                    ///////DELETE

////////////////////////////////////////////////deletePurchasesById

app.delete('/purchases/:id', async (req: Request, res: Response) => {

    try {
        const idToDelete = req.params.id

        const [purchase] = await db("users").where({ id: idToDelete })

        if (!purchase) {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        await db("purchases").del().where({ id: idToDelete })

        res.status(200).send('Usuário deletado com sucesso')

    } catch (error) {
        res.status(404).send('Id não encontrada')
        throw new Error("'id' não encontrada")
    }
})

app.delete('/products/:id', async (req: Request, res: Response) => {

    try {
        const idToDelete = req.params.id

        const [product] = await db("products").where({ id: idToDelete })

        if (!product) {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        await db("product").del().where({ id: idToDelete })

        res.status(200).send('Usuário deletado com sucesso')

    } catch (error) {
        res.status(404).send('Id não encontrada')
        throw new Error("'id' não encontrada")
    }
})