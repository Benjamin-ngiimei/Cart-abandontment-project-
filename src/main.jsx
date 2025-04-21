import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './component/Home';
import Cart from './component/Cart';
import { analytics } from './firebase/firebase-config';

// Initialize dataLayer before GTM loads
window.dataLayer = window.dataLayer || [];

// Initialize Firebase Analytics
if (analytics) {
  console.log('Firebase initialized', analytics);
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
    ],
  },
]);

// Track navigation
router.subscribe((state) => {
  window.dataLayer.push({
    event: 'pageview',
    pagePath: state.location.pathname,
    pageTitle: document.title
  });
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);