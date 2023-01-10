import { DUser, DProduct, DPurchase, Categoria } from "./types"

export const users: DUser[] = [{
    id: '1',
    email: 'string@gmail',
    password: '123'
}, {
    id: '2',
    email: 'teste@gmail',
    password: '12fcscs3'
}, {
    id: '3',
    email: 'email@gmail',
    password: '8503Ac.'
}]

export const products: DProduct[] = [{
    id: '1',
    name: 'Iphone12',
    price: 8500,
    category: Categoria.ELECTRONICS
}, {
    id: '2',
    name: 'Mouse Gamer',
    price: 550,
    category: Categoria.ELECTRONICS
}
]

let quantity = 0
for (let i in products){
    quantity += products[i].price
}

//USERS - GET E PUT
export const purchase: DPurchase[] = [{
    userId: users[0].id,
    productId: products[0].id,
    quantity: products.length,
    totalPrice: quantity
}]