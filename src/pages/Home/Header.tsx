import React from 'react';
import { Stack } from '@fluentui/react';
import { Link as RouterLink, Outlet } from "react-router-dom";
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
    titleStyle: {
      color: 'inherit',
      textDecorationLine: 'inherit',
      textDecorationStyle: 'inherit'
  }
  });

const Header = () => {
  const classes = useStyles();

  return (
    <>
    <Stack
      horizontal
      horizontalAlign="end"
      className={classes.navStyle}
      tokens={{ childrenGap: '1em' }}>

  <Button appearance="transparent" size='medium'><RouterLink to="/" className={classes.titleStyle}>Home</RouterLink></Button>
  <Button appearance="transparent" size='medium'><RouterLink to="/courses" className={classes.titleStyle}>Courses</RouterLink></Button>
  <Button appearance="transparent" size='medium'><RouterLink to="/feedback" className={classes.titleStyle}>Feedback</RouterLink></Button>
    </Stack>
    <Outlet />
    </>
  );
}

export default Header;