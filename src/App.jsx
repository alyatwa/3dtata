import routes from "./routes";
import Routes from "./Routes";
import Header from "./pages/Home/Header"

function App() {

  const routeResult = routes;
  return (
    <>
{/*<Header/>*/}
      <main>
        
        <Routes />
      </main>
    </>
  );
}

export default App;
