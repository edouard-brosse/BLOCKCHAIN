import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AppShell, Burger, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import { Text, Title } from '@mantine/core';
import Home from './pages/home';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Router>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <div>
            <Text 
            size='xl'
            fw={900}
            variant="gradient"
            gradient={{ from: 'blue', to: 'green', deg: 0 }}
            >
               MY CRYPTO APP
            </Text>
          </div>
        </AppShell.Header>

        <AppShell.Navbar p="md">

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ScrollArea>
          <ScrollArea>
            <div style={{ marginBottom: 10 }}>
              <div>
                <Link to="/">Home</Link>
              </div>

              <div>
                <Link to="/profile">Profile</Link>
              </div>
              <div>
                <Link to="/ProductsPage">Products</Link>
              </div>
              <div>
                <Link to="/CartPage">Cart</Link>
              </div>
              <div>
                  <Link to="/CheckoutPage">Checkout</Link>
              </div>
            </div>
          </ScrollArea>

          </ScrollArea>
        </div>

        </AppShell.Navbar>

        <AppShell.Main>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>} />
            <Route path="/register" element={
              <Register />
              } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
              } />
            <Route path="ProductsPage" element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>} />
            <Route path="CartPage" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>} />
            <Route path="CheckoutPage" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>} />
          </Routes>
        </AppShell.Main>
      </AppShell>

      
    </Router>
  );
}

export default App
