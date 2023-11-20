import { combineReducers } from 'redux';
import { createSlice, createAsyncThunk, Reducer } from '@reduxjs/toolkit';
import { CartState, Product, ProductsState } from '../types';

export const listProducts = createAsyncThunk('products/list', async (): Promise<Product[]> => {
    try {
        return await fetch('https://fakestoreapi.com/products').then(res => res.json()) 
    } catch {
       return []
    }
})

const productsSlice = createSlice<ProductsState, Record<string, never>, 'products'>({
    name: 'products',
    initialState: {
        status: 'idle',
        data: [],
        error: undefined
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(listProducts.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(listProducts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload;
          })
          .addCase(listProducts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          });
    }
})

const cartSlice = createSlice<CartState, Record<string, Reducer>, 'cart'>({
    name: 'cart',
    initialState: [],
    reducers: {
        clearCart(state) {
            state.length = 0
        },
        updateQuantity(state, action) {
            const preExistingProduct = state.find(p => p.productId === action.payload.productId)

            if (preExistingProduct) {
                if (action.payload.count === 0) {
                    state.splice(state.indexOf(preExistingProduct), 1)
                    return
                }
                preExistingProduct.count = action.payload.count
                return
            }

            state.push(action.payload)
        }
    }
})

export const { clearCart, updateQuantity } = cartSlice.actions

export const reducer = combineReducers({
    products: productsSlice.reducer,
    cart: cartSlice.reducer
})
