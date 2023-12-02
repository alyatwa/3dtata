import { useRef, useState, useEffect, useContext } from "react";
import Modules from "../pages/Module/Modules";
import {
	Maximize2,
	Minimize2,
	Minimize,
	Maximize,
	Pause,
	Play,
} from "react-feather";
import useSound from "use-sound";
import fullscreenSfx from "/sounds/Blow.mp3";
import { usePanel } from "../context/panel-context";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Divider,
	Radio,
	Switch,
} from "@nextui-org/react";

import { useSnapshot } from "valtio";
import { state } from "../context/panel-proxy";

const Panel = (props: any) => {
	//const { setPlayAnimation, playAnimation, viewParticles, setViewParticles, setEnableAnimationLoop, enableAnimationLoop } = usePanel();
	const {enableAnimationLoop, playAnimation}= useSnapshot(state)
	const module: any = props.metadata;
	const [play] = useSound(fullscreenSfx);
	//const [isAnimationPlay, setAnimationPlay] = useState(false);
	const [isPanelVisible, setPanelVisible] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [viewModules, setViewModules] = useState(false);

	const handleFullscreen = () => {
		play();
		isFullscreen
			? document.exitFullscreen()
			: document.body.requestFullscreen();
	};

	/* const handleAnimation = () => {
		setAnimationPlay(!isAnimationPlay);
		props.sendEvent({
			id: "play_animation",
			type: "toggleBtn",
			event: "playMainAnimation",
			value: !isAnimationPlay,
		});
	}; */

	const handlePanelVisible = () => {
		setPanelVisible(!isPanelVisible);
	};

	const handleViewModules = () => {
		setViewModules(!viewModules);
	};

	useEffect(() => {
		function onFullscreenChange() {
			setIsFullscreen(Boolean(document.fullscreenElement));
		}

		document.addEventListener("fullscreenchange", onFullscreenChange);

		return () =>
			document.removeEventListener("fullscreenchange", onFullscreenChange);
	}, []);

/* 	const updateControl = (object: any, newValue: any) => {
		let data = object;
		object.value = newValue;
		props.sendEvent(data);
	}; */
	type Control = {
		id: string;
		label: string;
		value: string;
		type: string;
	};
	const controlEvents = (control: Control) => {
		switch (control.type) {
			/* case "Switch":
				return (
					<Switch size="sm"
						defaultSelected
						key={control.id}
						onChange={(ev) => updateControl(control, ev.currentTarget.checked)}
					>
						{control.label}
					</Switch>
				); */
			case "enableLoop":
					return (
						<Switch size="sm"
							defaultSelected={enableAnimationLoop as boolean}
							isSelected={enableAnimationLoop as boolean}
							key={control.id}
							onChange={(ev) => state.enableAnimationLoop=ev.currentTarget.checked}
						>
							{control.label}
						</Switch>
					);
			/* case "showOrHideParticles":
				return (
					<Switch size="sm"
						defaultSelected={viewParticles}
						isSelected={viewParticles}
						key={control.id}
						onChange={(ev) => setViewParticles(ev.currentTarget.checked)}
					>
						{control.label}
					</Switch>
				); */
			case "Radio":
				return (
					<Radio size="sm" key={control.id} value={control.value}>
						{control.label}
					</Radio>
				);
			default:
				return null;
		}
	};
 
	return (
		<>
			{viewModules && (
				<div className="hidden">{/* <Modules data={props.course} /> */}</div>
			)} 
			<div className="absolute top-1/2 transform -translate-y-1/2 right-0 w-[300px] mr-[15px] z-4 ">
				<div className="flex justify-end">
					<Button
						isIconOnly
						radius="full"
						color="primary"
						disableRipple
						size="md"
						className="p-2"
						variant="solid"
						onClick={() => handlePanelVisible()}
					>
						{isPanelVisible ? <Minimize size={40} /> : <Maximize size={40} />}
					</Button>
				</div>
				{isPanelVisible && (
					<Card
						isBlurred
						className="border-none bg-background/60 dark:bg-default-100/50 mt-2 max-w-[610px]"
						shadow="sm"
					>
						<CardBody className="flex gap-2 flex-col">
							<p className="text-lg text-black/80 text-center">{module.title}</p>
							<div className="flex justify-center items-center "> 
							<Button 
								isIconOnly
								radius="full"
								color="primary"
								disableRipple
								size="md"
								className="p-2"
								variant={playAnimation ? "bordered" : "solid"}
								onClick={() => {state.playAnimation = !playAnimation as boolean}}
							>
								{playAnimation ? <Pause size={20} /> : <Play size={20} />}
							</Button>
							 </div>

							{module.controls.map((control: any) => controlEvents(control))}
						</CardBody>
						<Divider className="my-2" />
						<CardFooter className="justify-between before:bg-white/10  overflow-hidden py-1   ml-1 z-10">
							<Button disableRipple
								variant={viewModules ? "light" : "bordered"}
								onClick={() => handleViewModules()}
							>
								{viewModules ? "Hide modules" : "View modules"}
							</Button>
							<Button disableRipple
								variant={isFullscreen ? "bordered" : "light"}
								startContent={
									isFullscreen ? (
										<Minimize2 size={20} />
									) : (
										<Maximize2 size={20} />
									)
								}
								onClick={() => handleFullscreen()}
							>
								Full screen
							</Button>
						</CardFooter>
					</Card>
				)}
			</div>
		</>
	);
};
export default Panel;
