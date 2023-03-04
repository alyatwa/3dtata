import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
const container = document.getElementById('app');
const root = createRoot(container);
//import "./index.css";
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import App from "./App";

root.render(<React.StrictMode>

<FluentProvider theme={webLightTheme}>
    <BrowserRouter>
<App tab="home" />
</BrowserRouter>
</FluentProvider>

</React.StrictMode>);
