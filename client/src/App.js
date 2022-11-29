import './App.css';
import Topnav from './topnav';
import Home from './home/home';
import ArtistsPage from './artists/artistsPage';
import GenresPage from './genres/genresPage';
import ListsPage from './lists/listsPage';


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
    case "/Lists":
      Component = ListsPage;
      break
    default:
      Component = Home;
      break
  }
  return (
    <><Topnav/>
    <Component/></>
  );
}

export default App;
