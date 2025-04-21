import React, { useEffect, useState } from "react";
import Header from "./component/Header";
import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { analytics } from "./firebase/firebase-config";
import productList from "./component/data";

const App = () => {
  const [productId, setProductId] = useState("");
  const [cartAllProduct, setCartAllProduct] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const navigate = useNavigate();

  // Initialize dataLayer and track page view
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: window.location.pathname
    });

    if (analytics) {
      console.log("Firebase Analytics initialized");
    }
  }, []);

  // Persist cart to localStorage and track updates
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartAllProduct));
    
    window.dataLayer.push({
      event: "cart_updated",
      cart_value: calculateCartValue(),
      cart_items: cartAllProduct.map(item => ({
        item_id: item.id,
        item_name: item.model,
        price: item.price,
        quantity: item.count || 1
      }))
    });
  }, [cartAllProduct]);

  const calculateCartValue = () => {
    return cartAllProduct.reduce((total, item) => {
      return total + (item.price * (item.count || 1));
    }, 0);
  };

  // Handle adding products to cart
  useEffect(() => {
    if (productId) {
      setCartAllProduct(prev => {
        const existingProduct = prev.find(item => item.id === productId);
        const product = productList.find(p => p.id === productId);
        
        if (existingProduct) {
          return prev.map(item =>
            item.id === productId
              ? { ...item, count: (item.count || 1) + 1 }
              : item
          );
        } else if (product) {
          return [...prev, { ...product, count: 1 }];
        }
        return prev;
      });
      navigate('/cart');
    }
  }, [productId, navigate]);

  return (
    <div className="app">
      <Header cartAllProduct={cartAllProduct} />
      <Outlet context={{ 
        setProductId, 
        cartAllProduct, 
        setCartAllProduct 
      }} />
    </div>
  );
};

export default App;