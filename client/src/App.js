import './App.css';
import Topnav from './topnav';
import Home from './home/home';
import ArtistsPage from './artists/artistsPage';


function App() {
  let Component
  switch (window.location.pathname){
    case "/":
      Component = Home;
      break
    case "/Home":
      Component = Home;
      break
    case "/Artists":
      Component = ArtistsPage;
      break
  }
  return (
    <><Topnav/>
    <Component/></>
  );
}

export default App;
