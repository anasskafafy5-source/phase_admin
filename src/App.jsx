import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Accounts from './pages/Accounts.jsx'
import AddProduct from './pages/AddProduct.jsx'
import Categories from './pages/Categories.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EditProduct from './pages/EditProduct.jsx'
import Login from './pages/Login.jsx'
import Products from './pages/Products.jsx'
import Settings from './pages/Settings.jsx'
import AppLayout from './ui/AppLayout.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<AddProduct />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
