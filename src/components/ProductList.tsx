import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../types'
import { useEffect } from 'react'
import { listProducts, updateQuantity } from '../redux'
import { useNavigate } from 'react-router-dom'
import ReactLoading from 'react-loading'

export const ProductList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const products = useSelector((state: AppState) => state.products)
    const cart = useSelector((state: AppState) => state.cart)

    useEffect(() => {
        // @ts-ignore
        dispatch(listProducts())
    }, [])

    return (
        <div className="w-full flex flex-col items-center">
            <nav className="fixed flex justify-center w-full h-20 z-10 bg-slate-500 shadow-md shadow-slate-700">
                <button
                    className="w-max px-8 h-20 hover:bg-slate-200 font-bold text-lg text-white hover:text-black"
                    onClick={() => navigate('/cart')}
                >
                    CART
                </button>
            </nav>
            <div className="flex flex-wrap justify-center gap-4 p-4 relative top-20 w-[26rem] lg:w-[52rem]">
                {products.data?.length === 0 && <ReactLoading color="#000" type="spin" />}
                {products.data?.map(({ id, title, description, price, image }) => (
                    <div
                        key={id}
                        className="flex flex-col gap-2 w-44 bg-slate-200 rounded-md border-emerald-950 p-4"
                    >
                        <img src={image} className="object-cover h-44" />
                        <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis font-bold">
                            {title}
                        </div>
                        <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis font-light text-slate-700">
                            {description}
                        </div>
                        <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis">
                            ${price}
                        </div>
                        <button
                            onClick={() => {
                                const count = (cart.find(item => item.productId === id)?.count || 0) + 1
                                // @ts-ignore
                                dispatch(updateQuantity({ productId: id, count }))
                            }}
                            className="w-max p-1 rounded-md border-slate-500 border-2 hover:text-black text-white hover:bg-slate-200 bg-slate-500 shadow-2xl"
                        >
                            Add to cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}