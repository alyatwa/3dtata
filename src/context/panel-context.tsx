import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type panelType = {
	sendAction: () => void;
	viewParticles: boolean;
	setViewParticles: Dispatch<SetStateAction<boolean>>;
};

const PanelContext = createContext({
	sendAction: () => {},
	viewParticles: false,
  setViewParticles: () => {},
} as panelType);

export const PanelProvider = ({ children }: any) => {
	const [viewParticles, setViewParticles] = useState<boolean>(true);
	const sendAction = () => {
		console.log("sendAction");
	};
	return (
		<PanelContext.Provider
			value={{
				sendAction,
				viewParticles,
				setViewParticles,
			}}
		>
			{children}
		</PanelContext.Provider>
	);
};

export const usePanel = () => {
	return useContext(PanelContext);
};
