import routes from "./routes";
import Routes from "./Routes";
import Header from "./pages/Home/Header"

function App() {

  const routeResult = routes;
  return (
    <>
    <Header/>

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
