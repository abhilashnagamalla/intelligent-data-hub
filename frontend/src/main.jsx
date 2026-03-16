import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import AuthProvider from './context/AuthContext';
import ThemeProvider from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);