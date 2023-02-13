import { useRef, useState, useEffect } from 'react'
import { Button, Text, Switch, Divider, ToggleButton , makeStyles, shorthands  } from '@fluentui/react-components';
import {
    Stack
  } from "@fluentui/react";
  import {Card} from "@fluentui/react-card";
  import { Maximize2, Minimize2, Minimize, Maximize, Pause, Play } from 'react-feather';
  import useSound from 'use-sound';
  import fullscreenSfx from '../../../public/sounds/Blow.mp3';
  
    const useStyles = makeStyles({
        stackStyles:{
            ...shorthands.padding("8px")
        },
        controllerWrapper: {
            columnGap: "15px",
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center'
          },
          panelWrapper:{
            display: "flex",
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-end'
          },
          maximize:{
            top: '20px',
    left: '20px',
    zIndex: 1,
    position: 'relative'
          },
        divider:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyItems: "center",
        minHeight: "10px"}
      })

const Panel = props => {
    const Styles = useStyles();
    const [playFullscreen] = useSound(fullscreenSfx);
    const [isAnimationPlay, setAnimationPlay] = useState(false);
    const [isPanelVisible, setPanelVisible] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [viewmodules, setViewmodules] = useState(false);

    const handleFullscreen = () => {
        playFullscreen
        (isFullscreen ? document.exitFullscreen() : document.body.requestFullscreen())
      };

    const handleAnimation = () => {
        setAnimationPlay(!isAnimationPlay)
      };

    const handlePanelVisible = () => {
        setPanelVisible(!isPanelVisible)
      };

    useEffect(() => {
        function onFullscreenChange() {
            
          setIsFullscreen(Boolean(document.fullscreenElement));
        }
              
        document.addEventListener('fullscreenchange', onFullscreenChange);
      
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
      }, []);
      

   //const classNames = getClassNames(styles, { theme });
   const stackTokens = { childrenGap: 6 };
   const headerTokens = { childrenGap: 10 };
  return (

    <div className={Styles.panelWrapper}>    
        <ToggleButton className={Styles.maximize} appearance={isPanelVisible ? "subtle" : "primary" } checked={isPanelVisible}
    icon={isPanelVisible ? <Minimize size={50} /> : <Maximize size={50} />}
    onClick={() => handlePanelVisible()}  size="large"  shape="circular"  />

{isPanelVisible &&
<Card>
    <Stack enableScopedSelectors className={Styles.stackStyles} tokens={stackTokens}>

   
        <Stack enableScopedSelectors horizontalAlign="center" tokens={headerTokens}>
 <Text block={true} as='h2' weight="semibold" size={400} align='center'>Contactor Overview</Text>
    <ToggleButton checked={isAnimationPlay} size="large"  shape="circular" appearance={isAnimationPlay ? "outline" : "primary" }
    icon={isAnimationPlay ? <Pause size={20} /> : <Play size={20} />}
    onClick={() => handleAnimation()}>{isAnimationPlay ? 'Pause Animation' : 'Play Animation'}</ToggleButton>
</Stack>

    <Stack enableScopedSelectors horizontalAlign="start">
    <Switch label="This is a switch"/>
    <Switch label="This is a switch"/>
</Stack>

    <Text block={true} as='p' weight="regular" size={300} align='start'>Back in the good old days, the limits of CSS made even “simple” things like vertical centering a challenge, with some developers even relying on JavaScript solutions. It was fragile</Text>
    
    <div className={Styles.divider}>
    <Divider/>
    </div>
    <div className={Styles.controllerWrapper}>
    <ToggleButton appearance="transparent" onClick={() => setViewmodules(!viewmodules)}>View modules</ToggleButton>
    <ToggleButton appearance={isFullscreen ? "outline" : "subtle" } checked={isFullscreen}
    icon={isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
    onClick={() => handleFullscreen()}>Full screen</ToggleButton>
    </div>
    </Stack>

    </Card>}

    </div> 
         
        
  );
}
export default Panel;