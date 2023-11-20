import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../types'
import { useNavigate } from 'react-router-dom'
import { clearCart, updateQuantity } from '../redux'
import { useRef, useState } from 'react'

export const Cart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const products = useSelector((state: AppState) => state.products)
    const cart = useSelector((state: AppState) => state.cart)
    const [selectingQuantityId, setSelectingQuantityId] = useState<number | null>(null)
    const popoverHoverTimeoutId = useRef<number | null>(null)

    const cartTotalPrice = (cart.reduce((prev, { productId, count }) => {
        const product = products.data?.find(p => p.id === productId)
        if (!product) return prev
        return prev + product.price * count
    }, 0)).toFixed(2)

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <nav className="fixed flex justify-center w-full h-20 z-10 bg-slate-500 shadow-md shadow-slate-700">
                <button
                    className="w-max px-8 h-20 hover:bg-slate-200 font-bold text-lg text-white hover:text-black"
                    onClick={() => navigate('/')}
                >
                    LISTINGS
                </button>
                <button
                    className="w-max px-8 h-20 hover:bg-slate-200 font-bold text-lg text-white hover:text-black"
                    onClick={() => dispatch(clearCart())}
                >
                    CLEAR CART
                </button>
            </nav>
            {cart.length === 0 && (
                <div className="text-left">
                    <h1 className="mt-24 font-bold text-[2rem] lg:text-[4rem]">
                        Your cart is empty.
                    </h1>
                    <div className="text-2xl lg:text-[3rem] mt-2 lg:mt-6">
                        🛒 🛍️ 🛒 🛍️ 🛒 🛍️ 🛒 🛍️ 🛒 🛍️
                    </div>
                    <div className="mt-6 lg:mt-12 lg:text-lg">
                        Head back to&nbsp;
                        <button
                            onClick={() => navigate('/')}
                            className="text-blue-600 hover:underline"
                        >
                            product listings.
                        </button>
                    </div>
                    
                </div>
            )}
            {cart.map(({ productId, count }, i) => {
                const product = products.data?.find(p => p.id === productId)
                if (!product) return <></>

                const { id, title, description, price, image } = product

                return (
                    <div
                        key={id}
                        className={`relative flex gap-2 w-[min(80vw,736px)] bg-slate-200 rounded-md p-4 ${i === 0 ? 'mt-24' : ''}`}
                    >
                        <img src={image} className="object-cover w-1/4 aspect-square"/>
                        <div className="flex flex-col gap-2 w-[70%]">
                            <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis font-bold md:text-xl lg:text-2xl">
                                {title}
                            </div>
                            <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis font-light text-slate-700">
                                {description}
                            </div>
                            <div>
                                ${price}
                            </div>
                            <div className="relative w-max p-1 rounded-md text-white bg-slate-500 shadow-slate-700 shadow-2xl">
                                <span>
                                    Qty: {count}&nbsp;
                                </span>
                                <button onClick={() => setSelectingQuantityId(id)}>
                                    ⬇️
                                </button>
                                {selectingQuantityId === id && (
                                    <div
                                        onMouseLeave={() => {
                                            popoverHoverTimeoutId.current = setTimeout(() => {
                                                popoverHoverTimeoutId.current = null
                                                setSelectingQuantityId(null)
                                            }, 1000)
                                        }}
                                        onMouseEnter={() => {
                                            if (popoverHoverTimeoutId.current) {
                                                clearTimeout(popoverHoverTimeoutId.current)
                                                popoverHoverTimeoutId.current = null
                                            }
                                        }}
                                        className={`absolute right-[-2.5rem] ${i === 0 ? 'top' : 'bottom'}-0 flex flex-col w-16 rounded-md shadow-slate-700 shadow-lg bg-white text-black z-10`}
                                    >
                                        {(() => {
                                            const options = []
                                            for (let i = Math.max(0, count - 5); i < Math.max(10, count + 5); i++) {
                                                options.push(
                                                    <div
                                                        key={i}
                                                        className="p-1 hover:bg-slate-200"
                                                        onClick={() => {
                                                            // @ts-ignore
                                                            dispatch(updateQuantity({ productId: id, count: i }))
                                                            setSelectingQuantityId(null)
                                                        }}
                                                    >
                                                        {i}
                                                    </div>
                                                )
                                            }
                                            return options
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-3 right-3 flex flex-col">
                            <span className="font-light text-slate-700 text-sm sm:text-base">Subtotal:</span>
                            <strong>${(price * count).toFixed(2)}</strong>
                        </div>
                    </div>
                )
            })}
            {cart.length > 0 && (
                <div className="relative w-[min(80vw,736px)] mb-8">
                    <span className="absolute right-3 text-xl">
                        Total in cart: <strong>${cartTotalPrice}</strong>
                    </span>
                </div>
            )}
        </div>
    )
}