import React, { useEffect, useState } from "react";

import renderFormLine from "./helpers/renderFormLine";
import makePrevPlaylists from "./helpers/makePrevPlaylists";
import handleLookup from "./helpers/handleLookup";

const spinner = () => (
  <svg
    id="spinner"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#ffffff"
  >
    <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z" />
  </svg>
);

function App() {
  const [numberOfTracks, setNumberOfTracks] = useState(20);
  const [submission, setSubmission] = useState([["", 100, ""]]); // id, %age, name (generated by func)
  const [prevs, setPrevs] = useState({ playlists: [], compositions: [] });
  const [globalError, setGlobalError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch("/getPrev")
      .then((x) => x.json())
      .then((json) => setPrevs(json))
      .catch((e) => {
        console.log(e);
        return displayError("Error. Are you logged in?");
        // const url = new URL(window.location.href);
        // alert(JSON.stringify(url), "You're not logged in to Spotify");
        // return (window.location.href = url.origin);
      });
  }, []);

  const displayError = (msg) => {
    setIsCreating(false);
    setTimeout(() => setGlobalError(""), 7000);
    return setGlobalError(msg);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "tracks") setNumberOfTracks(value);
    if (name.match(/^playlist/)) {
      const num = name.replace("playlist", "").toString();
      const newSub = [...submission];
      newSub[num][0] = value;
      // setSubmission(newSub);
      if (value.match(/^spotify:playlist:[a-zA-Z0-9]{22}$/)) {
        handleLookup(value, num, submission, setSubmission, displayError);
      } else {
        newSub[num][2] = "";
        setSubmission(newSub);
      }
      return;
    }
    if (name.match(/^percent/)) {
      const num = name.replace("percent", "").toString();
      const newSub = [...submission];
      newSub[num][1] = value;
      setSubmission(newSub);
    }
  };
  const addFormLine = (e) => {
    const newSub = [...submission];
    newSub.push(["", 0]);
    setSubmission(newSub);
  };
  const removeFormLine = (e) => {
    const newSub = submission.filter(
      (_, index) => index !== Number(e.target.value)
    );
    setSubmission(newSub);
  };

  const calcTotal = (submission) =>
    submission.reduce((acc, curr) => acc + Number(curr[1]), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCreating(true);
    if (calcTotal(submission) !== 100) {
      return displayError("C'mon. That's not 100%, Brad.");
    }
    const allPlaylistNames = submission.map((s) => s[2]);
    if (allPlaylistNames.includes("")) {
      return displayError("Missing a valid playlist there?");
    }
    fetch("/make", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        arrayOfArrays: submission,
        numberOfTracks,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const { listId, timestamp, error } = json;
        if (error) {
          return displayError(error);
        }
        const url = new URL(window.location.href);
        return (window.location.href = `${url.origin}/radio?listId=${listId}&timestamp=${timestamp}`);
      })
      .catch((e) => {
        console.log(e);
        return displayError("Serious failure; sorry.");
      });
  };

  return (
    <div className="App">
      <h1>radio nachos playmaker</h1>
      <form id="creator-form">
        <fieldset id="fieldset">
          <div id="all-entries">
            {submission.map((array, index) =>
              renderFormLine(
                index,
                array,
                handleInputChange,
                addFormLine,
                removeFormLine,
                index === submission.length - 1,
                submission.length === 1
              )
            )}
          </div>
          <p id="total">{calcTotal(submission)}</p>
          <p id="currentVal">{numberOfTracks}</p>

          <label htmlFor="tracks">how many tracks? (10 - 99)</label>
          <br />
          <input
            type="range"
            id="tracks-input"
            name="tracks"
            value={numberOfTracks}
            min="10"
            max="99"
            step="1"
            onChange={handleInputChange}
          />
          <br />
          <div id="count-and-button">
            <span id="global-error">{globalError}</span>
            <button
              id="submit-btn"
              type="submit"
              onClick={handleSubmit}
              disabled={isCreating}
            >
              {isCreating ? <span>{spinner()}</span> : "create playlist"}
            </button>
          </div>
        </fieldset>
      </form>

      <h2>Previous playlists</h2>
      <ul id="previous">
        {!prevs.playlists.length && (
          <li>
            <p id="nope">you have no previous playlists</p>
          </li>
        )}
        {makePrevPlaylists(prevs, setSubmission, setNumberOfTracks)}
      </ul>
    </div>
  );
}

export default App;
