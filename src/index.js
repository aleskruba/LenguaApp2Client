import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import { AuthProvider } from './context/AuthProvider.js';
import { StyledEngineProvider } from '@mui/material/styles';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
    <StyledEngineProvider injectFirst>
      <Routes>
        <Route path="/*" element={<App/>} />
      </Routes>
      </StyledEngineProvider>
    </AuthProvider>
</BrowserRouter>
);

