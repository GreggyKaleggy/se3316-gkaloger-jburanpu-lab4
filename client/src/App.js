import './App.css';
import Topnav from './topnav';
import Landing from './landing/landingPage';
import Home from './home/home';
import ArtistsPage from './artists/artistsPage';
import GenresPage from './genres/genresPage';
import ListsPage from './lists/listsPage';
import TracksPage from './tracks/tracksPage';
import LoginPage from './login/login';
import Logout from './logout/logout';
import RegisterPage from './register/register';


function App() {
  let Component
  switch (window.location.pathname) {
    case "/":
      Component = Landing;
      break
    case '/login':
      Component = LoginPage;
      break
    case "/logout":
      Component = Logout;
      break
    case "/register":
      Component = RegisterPage;
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
    case "/Tracks":
      Component = TracksPage;
      break
    default:
      Component = Landing;
      break
  }
  return (
    <><Topnav />
      <Component /></>
  );
}

export default App;
