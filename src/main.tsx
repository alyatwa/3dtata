import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
const root = createRoot(document.getElementById("app") as HTMLElement);
//import "./index.css";
import "./three-elements";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import App from "./App";
import "tailwindcss/tailwind.css";
import { PanelProvider } from "./context/panel-context";

root.render(
	<React.StrictMode>
		<FluentProvider theme={webLightTheme}>
			<BrowserRouter>
				<PanelProvider>
					<App />
				</PanelProvider>
			</BrowserRouter>
		</FluentProvider>
	</React.StrictMode>
);
