import React from 'react';
import './lists.css';

function ListsPage() {
  return (
    <div>
        <div id="newList">
          <h2>Create a new list</h2>
          <form>
            <label htmlFor="listName">Enter a new list name</label>
            <br />
            <input type="text" id="listName" name="listName" />
            <br />
            <input type="button" defaultValue="Add" onclick="newList(document.getElementById('listName').value)" />
          </form>
        </div>
        <br />
        <hr />
        <br />
        <div id="addTrack">
          <h2>Add tracks to an existing list</h2>
          <form>
            <label htmlFor="listID">Enter a list name</label>
            <br />
            <input type="text" id="listID" name="listID" />
            <br />
            <label htmlFor="trackID">Enter a track ID</label>
            <br />
            <input type="text" id="trackID" name="trackID" />
            <br />
            <input type="button" defaultValue="Submit" onclick="addTrackToList(document.getElementById('listID').value, document.getElementById('trackID').value)" />
          </form>
        </div>
        <br />
        <hr />
        <br />
        <div id="listSearch">
          <h2>Get all tracks in a list</h2>
          <form>
            <label htmlFor="trackName">Enter a track name</label>
            <br />
            <input type="text" id="trackName" name="trackName" />
            <br />
            <input type="button" defaultValue="Search" onclick="listSearch(document.getElementById('trackName').value)" />
          </form>
          <hr />
        </div>
        <br />
        <br />
        <div id="deleteList">
          <h2>Delete a list</h2>
          <form>
            <label htmlFor="listName">Enter a list ID</label>
            <br />
            <input type="text" id="name" name="listName" />
            <br />
            <input type="button" defaultValue="Delete" onclick="deleteListbyName(document.getElementById('name').value)" />
          </form>
          <h2>Search Results</h2>
          <div id="results">
          </div>
          <hr />
          <div id="lists">
            <h2>All Lists</h2>
            <form>
            <label htmlFor="name">Lists:</label>
            <br />
            <input type="button" defaultValue="Get Lists" onclick="" />
            </form>
          </div>
        </div>
    </div>
  );
}

export default ListsPage;