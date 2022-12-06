import './App.css';
import Topnav from './modules/topnav';
import Landing from './landing/landingPage';
import Home from './home/home';
import ArtistsPage from './artists/artistsPage';
import CreateList from './createList/createList';
import MyLists from './myLists/myLists';
import EditList from './editList/editList';
import LoginPage from './login/login';
import Logout from './logout/logout';
import RegisterPage from './register/register';
import AUP from './footerLinks/AUP';
import DMCA from './footerLinks/DMCA';
import Privacy from './footerLinks/Privacy';
import Instructions from './footerLinks/Instructions';

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
    case "/CreateList":
      Component = CreateList;
      break
    case "/MyLists":
      Component = MyLists;
      break
    case "/EditList":
      Component = EditList;
      break
    case "/AUP":
      Component = AUP;
      break
    case "/Privacy":
      Component = Privacy;
      break
    case "/DMCA":
      Component = DMCA;
      break
    case "/Instructions":
      Component = Instructions;
      break
    default:
      Component = Landing;
      break
  }
  return (
    <><Topnav />
      <Component />
    </>
  );
}

export default App;
