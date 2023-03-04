import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
const container = document.getElementById('app');
const root = createRoot(container);
//import "./index.css";
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import App from "./App";
import { ConfiguratorProvider } from "./contexts/Configurator";

root.render(<React.StrictMode>
<BrowserRouter>
<ConfiguratorProvider>
<FluentProvider theme={webLightTheme}>
<App tab="home" />
</FluentProvider>
</ConfiguratorProvider>
</BrowserRouter>
</React.StrictMode>);
