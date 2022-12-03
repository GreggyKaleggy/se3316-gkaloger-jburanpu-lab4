import './landing.css';

function Landing() {
  const login = localStorage.getItem("isLoggedIn");

  return (
    <div>
      <h1>3316 Lab 4 - Landing Page</h1>
      <h2>Welcome to Lab 4!</h2>
      <hr />
      <h2>Log-in</h2>
      <h3>Unauthenticated users have limited functionality! Make sure to authenticate your account!</h3>
      {!login ? <p>Want to join? <a href="/register">Register</a> or <a href="/login">Log in</a> today!</p> : null}
      <h2>Unauthenticated user Functionality:</h2>
      <hr />
      <h2>Home</h2>
      <h3>On the home page, users can search for tracks as well as see the 10 most recent public playlists </h3>
      <h4>Tracks can be searched by any combination of Track Name, Artist, and Genre</h4>
      <h2>Authenticated user Functionality:</h2>
      <hr />
      <h2>My Lists</h2>
      <h3>Users can view all of the lists that they have created</h3>
      <h4>Each user can have up to 20 lists</h4>
      <h2>Create List</h2>
      <h3>Users can create a playlist</h3>
      <h2>Edit List</h2>
      <h3>Users can edit a playlist</h3>
    </div>
  );
}

export default Landing;
