export type Product = {
    id: number
    title: string
    price: number
    category: string
    description: string
    image: string
}

export type ProductsState = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    data: Product[]
    error: string |  undefined
}

export type CartState = { productId: number, count: number }[]

export type AppState = {
    products: ProductsState
    cart: CartState
}