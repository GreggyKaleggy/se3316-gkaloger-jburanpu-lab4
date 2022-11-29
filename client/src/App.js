import './App.css';
import Topnav from './topnav';
import Home from './home/home';
import ArtistsPage from './artists/artistsPage';
import GenresPage from './genres/genresPage';


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
    case "/Genres":
      Component = GenresPage;
      break
  }
  return (
    <><Topnav/>
    <Component/></>
  );
}

export default App;
