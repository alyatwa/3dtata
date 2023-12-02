import {
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	useState,
} from "react";

type panelType = {
	sendAction: () => void;
	viewParticles: boolean;
	enableAnimationLoop: boolean;
	playAnimation: boolean;
	setViewParticles: Dispatch<SetStateAction<boolean>>;
	setPlayAnimation: Dispatch<SetStateAction<boolean>>;
	setEnableAnimationLoop: Dispatch<SetStateAction<boolean>>;
};

const PanelContext = createContext({
	sendAction: () => {},
	viewParticles: false,
	playAnimation: true,
	enableAnimationLoop: false,
	setViewParticles: () => {},
	setEnableAnimationLoop: () => {},
	setPlayAnimation: () => {}
} as panelType);

export const PanelProvider = ({ children }: any) => {
	const [viewParticles, setViewParticles] = useState<boolean>(true);
	const [enableAnimationLoop, setEnableAnimationLoop] = useState<boolean>(true);
	const [playAnimation, setPlayAnimation] = useState<boolean>(true);
	const sendAction = () => {
		console.log("sendAction");
	};
	return (
		<PanelContext.Provider
			value={{
				enableAnimationLoop,
				setEnableAnimationLoop,
				playAnimation,
				setPlayAnimation,
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
