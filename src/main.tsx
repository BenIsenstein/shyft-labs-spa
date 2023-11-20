import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import { store } from './redux';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Cart, ProductList } from "./components"

const router = createBrowserRouter([
  {
    path: "/",
    element:  <ProductList />
  },
  {
    path: "/cart",
    element: <Cart />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
