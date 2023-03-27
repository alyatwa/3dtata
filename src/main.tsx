import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
const root = createRoot(document.getElementById('app') as HTMLElement);
//import "./index.css";
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import App from "./App";

root.render(<React.StrictMode>

<FluentProvider theme={webLightTheme}>
    <BrowserRouter>
<App />
</BrowserRouter>
</FluentProvider>

</React.StrictMode>);
