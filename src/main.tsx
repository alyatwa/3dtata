import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
const root = createRoot(document.getElementById("app") as HTMLElement);
//import "./index.css";
import "./three-elements";
import App from "./App";
import "tailwindcss/tailwind.css";
import {NextUIProvider} from '@nextui-org/react'
import { PanelProvider } from "./context/panel-context";

root.render(
	<React.StrictMode>
		<NextUIProvider>
			<BrowserRouter>
				<PanelProvider>
					<App />
				</PanelProvider>
			</BrowserRouter>
		</NextUIProvider>
	</React.StrictMode>
);
