import React from "react";
import productList from "./data";
import toast, { Toaster } from "react-hot-toast";
import { analytics, logEvent } from "../firebase/firebase-config";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const { setProductId } = useOutletContext();

  const handleAddToCart = (product) => {
    // GTM Data Layer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        items: [{
          item_id: product.id,
          item_name: product.model,
          price: product.price,
          item_brand: product.brand,
          quantity: 1
        }]
      }
    });

    // Firebase Analytics
    logEvent(analytics, "add_to_cart", {
      currency: "INR",
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.model,
        price: product.price,
        quantity: 1
      }]
    });

    setProductId(product.id);
    toast.success("Product Added Successfully!");
  };

  return (
    <div className="container-fluid px-5">
      <div className="row gap-4 justify-content-center">
        <Toaster />
        {productList?.map((product) => (
          <div className="col-2 border rounded mt-2" key={product.id}>
            <div className="d-flex justify-content-center p-2">
              <img 
                src={product.img} 
                alt={`${product.brand} ${product.model}`} 
                className="product-size" 
              />
            </div>
            <div className="py-2">
              <div className="d-flex justify-content-between px-2">
                <p className="m-0 font-bold font-size-12">{product.brand}</p>
                <p className="m-0 font-bold font-size-12">{product.model}</p>
              </div>
              <div className="px-2">
                <p className="m-0">
                  <span className="font-bold">₹</span> {product.price}
                </p>
                <p className="m-0 text-hiding">{product.space}</p>
              </div>
              <div className="px-2 mt-1">
                <button
                  className="btn btn-primary p-1 w-100"
                  onClick={() => handleAddToCart(product)}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;