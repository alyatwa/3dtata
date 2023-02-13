import React from 'react';
import { Stack, classNamesFunction } from '@fluentui/react';
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, shorthands, Button, Link  } from '@fluentui/react-components';

const useStyles = makeStyles({
    navStyle: {
      zIndex: 5,
      position: 'relative',
      width: '100%',
      height: '75px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'spaceBetween',
      backgroundColor: 'rgb(243, 243, 243, 0.533)',
      ...shorthands.borderBottom('1px', 'solid', 'rgba(0, 0, 0, 0.133)'),
      backdropFilter: 'blur(10px)'
    },
    
  });

const titleStyle = {
        color: 'inherit',
        textDecorationLine: 'inherit',
        textDecorationStyle: 'inhetit'
    }

const getStyles = ({ theme }) => {
  return {
    root: {
      borderBottomStyle: 'solid',
      borderBottomColor: theme.semanticColors.bodyFrameDivider,
      borderBottomWidth: 1,
      padding: theme.spacing.s1,
      height: 48
    }
  };
};

const getClassNames = classNamesFunction();

const Header = ({ styles, theme }) => {
  //const classNames = getClassNames(styles, { theme });
  const classes = useStyles();

  return (
    <Stack
      horizontal
      horizontalAlign="end"
      className={classes.navStyle}
      tokens={{ childrenGap: '1em' }}>

  <Button appearance="transparent" size='medium'><RouterLink to="/" style={titleStyle}>Home</RouterLink></Button>
  <Button appearance="transparent" size='medium'><RouterLink to="/courses" style={titleStyle}>Courses</RouterLink></Button>
  <Button appearance="transparent" size='medium'><RouterLink to="/feedback" style={titleStyle}>Feedback</RouterLink></Button>
    </Stack>
  );
}

export default Header;