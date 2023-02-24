import React from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import "@fontsource/source-sans-pro"
import './index.css';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'
import { RouterProvider } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'

import { store } from './store'
import router from "./routes/index";
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
