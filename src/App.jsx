import { Link, useRoutes } from "react-router-dom";

import routes from "./routes";
import Routes from "./Routes";
import { makeStyles, shorthands  } from '@fluentui/react-components';


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

  }
});

function App() {
  const classes = useStyles();

  const routeResult = routes;
  return (
    <>
      <header className={classes.navStyle}>
        <strong>3D Tata</strong>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* You can use by useRoutes like this (I prefer it): */}
        {/* {routeResult} */}
        {/* Or use by defining it */}
        <Routes />
      </main>
    </>
  );
}

export default App;
