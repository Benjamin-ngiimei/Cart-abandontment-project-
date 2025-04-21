import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import productList from "./data";
import { analytics, logEvent } from "../firebase/firebase-config";

const Cart = () => {
  const { cartAllProduct, setCartAllProduct } = useOutletContext();

  // Track cart abandonment
  useEffect(() => {
    return () => {
      if (cartAllProduct.length > 0 && analytics) {
        const cartValue = cartAllProduct.reduce(
          (sum, item) => sum + (item.price * (item.count || 1)), 
          0
        );
        
        // GTM Data Layer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "cart_abandoned",
          ecommerce: {
            value: cartValue,
            items: cartAllProduct.map(item => ({
              item_id: item.id,
              item_name: item.model,
              price: item.price,
              quantity: item.count || 1
            }))
          }
        });

        // Firebase Analytics
        logEvent(analytics, "begin_checkout", {
          currency: "INR",
          value: cartValue,
          items: cartAllProduct.map(item => ({
            item_id: item.id,
            item_name: item.model,
            price: item.price,
            quantity: item.count || 1
          }))
        });
      }
    };
  }, [cartAllProduct]);

  const handleIncrement = (id) => {
    setCartAllProduct(prev =>
      prev.map(item =>
        item.id === id 
          ? { ...item, count: (item.count || 1) + 1 } 
          : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCartAllProduct(prev =>
      prev.map(item =>
        item.id === id && (item.count || 1) > 1
          ? { ...item, count: item.count - 1 }
          : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setCartAllProduct(prev => prev.filter(item => item.id !== id));
  };

  const cartItems = cartAllProduct.map(item => {
    const product = productList.find(p => p.id === item.id);
    return product ? { ...product, count: item.count || 1 } : null;
  }).filter(Boolean);

  return (
    <div className="container-fluid">
      <div className="row p-3 gap-3">
        {cartItems.map((product) => (
          <div className="col-8 border rounded d-flex gap-3" key={product.id}>
            <div className="p-1">
              <img
                src={product.img}
                alt={product.model}
                className="cart-product-size"
              />
            </div>
            <div className="p-1 d-flex gap-3">
              <div>
                <h3 className="text-hiding m-0">
                  {product.model?.toUpperCase()}
                </h3>
                <p className="m-0 fs-5">
                  <span className="font-bold">₹</span> {product.price}
                </p>
                <div className="d-flex gap-3 mt-1">
                  <button
                    className="m-0 border p-0 px-2 py-1 rounded pointer"
                    onClick={() => handleDecrement(product.id)}
                  >
                    -
                  </button>
                  <p className="m-0">{product.count}</p>
                  <button
                    className="m-0 border p-0 px-2 py-1 rounded pointer"
                    onClick={() => handleIncrement(product.id)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="d-flex">
                <button 
                  onClick={() => handleDeleteItem(product.id)}
                  className="border-0 bg-transparent"
                >
                  <i className="fa-solid fa-trash text-danger pointer"></i>
                </button>
              </div>
            </div>
          </div>
        ))}

        {cartItems.length === 0 && (
          <div className="col-12">
            <h1 className="text-center fs-3">No Products Available in Cart</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;