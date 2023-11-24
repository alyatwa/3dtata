import { useRef, useState, useEffect, useContext } from "react";
import {
	Text,
	Switch,
	Radio,
	Divider,
	ToggleButton,
	makeStyles,
	shorthands,
} from "@fluentui/react-components";
import { Stack } from "@fluentui/react";
import { Card } from "@fluentui/react-card";
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

const useStyles = makeStyles({
	stackStyles: {
		...shorthands.padding("8px"),
	},
	CarouselStyle: {
		position: "absolute",
		bottom: "20px",
		height: "150px",
		marginRight: "20px",
		marginLeft: "20px",
		...shorthands.padding("15px"),
		//width: 'calc(100vw - 390px)',
		width: "50%",
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		...shorthands.borderRadius("10px"),
		boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
		backdropFilter: "blur(6.5px)",
		...shorthands.border("1px solid rgba(255, 255, 255, 0.83))"),
	},
	controllerWrapper: {
		columnGap: "15px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	panelWrapper: {
		position: "absolute",
		width: "300px",
		marginRight: "40px",
		zIndex: 4,
		top: "50%",
		right: 0,
		transform: "translateY(-50%)",
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-end",
	},
	maximize: {
		top: "20px",
		left: "20px",
		zIndex: 1,
		position: "relative",
	},
	divider: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyItems: "center",
		minHeight: "10px",
	},
});

const Panel = (props: any) => {
	const { sendAction, viewParticles, setViewParticles } = usePanel();
	const module: any = props.metadata;
	const Styles = useStyles();
	const [play] = useSound(fullscreenSfx);
	const [isAnimationPlay, setAnimationPlay] = useState(false);
	const [isPanelVisible, setPanelVisible] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [viewmodules, setViewmodules] = useState(false);

	const handleFullscreen = () => {
		play();
		isFullscreen
			? document.exitFullscreen()
			: document.body.requestFullscreen();
	};

	const handleAnimation = () => {
		setAnimationPlay(!isAnimationPlay);
		props.sendEvent({
			id: "play_animation",
			type: "toggleBtn",
			event: "playMainAnimation",
			value: !isAnimationPlay,
		});
	};

	const handlePanelVisible = () => {
		setPanelVisible(!isPanelVisible);
	};

	const handleViewModules = () => {
		setViewmodules(!viewmodules);
	};

	useEffect(() => {
		function onFullscreenChange() {
			setIsFullscreen(Boolean(document.fullscreenElement));
		}

		document.addEventListener("fullscreenchange", onFullscreenChange);

		return () =>
			document.removeEventListener("fullscreenchange", onFullscreenChange);
	}, []);

	const updateControl = (object: any, newValue: any) => {
		let data = object;
		object.value = newValue;
		props.sendEvent(data);
	};
type Control = {
	id:string,
	label:string,
	value:string,
	type: 'Switch' | 'showOrHideParticles' | 'Radio',
}
	const controlEvents = (control: Control) => {
		switch (control.type) {
			case "Switch":
				return (
					<Switch
						key={control.id}
						onChange={(ev) => updateControl(control, ev.currentTarget.checked)}
						label={control.label}
					/>
				);
			case "showOrHideParticles":
					return (
						<Switch
							key={control.id}
							checked={viewParticles}
							onChange={(ev) => setViewParticles(ev.currentTarget.checked)}
							label={control.label}
						/>
					);
			case "Radio":
				return (
					<Radio value={control.value} key={control.id} label={control.label} />
				);
			default:
				return null;
		}
	};

	const stackTokens = { childrenGap: 6 };
	const headerTokens = { childrenGap: 10 };
	return (
		<>
			{viewmodules && (
				<div className={Styles.CarouselStyle}>
					<Modules data={props.course} />
				</div>
			)}
			<div className={Styles.panelWrapper}>
				<ToggleButton
					className={Styles.maximize}
					appearance={isPanelVisible ? "subtle" : "primary"}
					checked={isPanelVisible}
					icon={
						isPanelVisible ? <Minimize size={50} /> : <Maximize size={50} />
					}
					onClick={() => handlePanelVisible()}
					size="large"
					shape="circular"
				/>

				{isPanelVisible && (
					<Card>
						<Stack
							enableScopedSelectors
							className={Styles.stackStyles}
							tokens={stackTokens}
						>
							<Stack
								enableScopedSelectors
								horizontalAlign="center"
								tokens={headerTokens}
							>
								<Text
									block={true}
									as="h2"
									weight="semibold"
									size={400}
									align="center"
								>
									{module.title}
								</Text>
								<ToggleButton
									checked={isAnimationPlay}
									size="large"
									shape="circular"
									appearance={isAnimationPlay ? "outline" : "primary"}
									icon={
										isAnimationPlay ? <Pause size={20} /> : <Play size={20} />
									}
									onClick={() => handleAnimation()}
								>
									{isAnimationPlay ? "Pause Animation" : "Play Animation"}
								</ToggleButton>
							</Stack>

							<Stack enableScopedSelectors horizontalAlign="start">
								{module.controls.map((control: any) => controlEvents(control))}
							</Stack>

							<Text
								block={true}
								as="p"
								weight="regular"
								size={300}
								align="start"
							>
								{module.description}
							</Text>

							<div className={Styles.divider}>
								<Divider />
							</div>
							<div className={Styles.controllerWrapper}>
								<ToggleButton
									appearance={viewmodules ? "transparent" : "outline"}
									onClick={() => handleViewModules()}
								>
									{viewmodules ? "Hide modules" : "View modules"}
								</ToggleButton>
								<ToggleButton
									appearance={isFullscreen ? "outline" : "subtle"}
									checked={isFullscreen}
									icon={
										isFullscreen ? (
											<Minimize2 size={20} />
										) : (
											<Maximize2 size={20} />
										)
									}
									onClick={() => handleFullscreen()}
								>
									Full screen
								</ToggleButton>
							</div>
						</Stack>
					</Card>
				)}
			</div>
		</>
	);
};
export default Panel;
