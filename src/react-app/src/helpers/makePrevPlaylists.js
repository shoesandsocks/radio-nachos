import React from "react";

export default (prevs, setSubmission, setNumberOfTracks) => {
  const populateForm = (e) => {
    const composition = JSON.parse(e.target.dataset.composition);
    const { tracks } = e.target.dataset;
    const newSub = composition.map((comp) => [
      comp.playlistId,
      comp.percentage,
      comp.playlistName,
    ]);
    setSubmission(newSub);
    setNumberOfTracks(tracks);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  const deletePlaylist = (e) => {
    const { id } = e.target;
    const idToDelete = id.replace("playlist-", "");
    fetch("/deletePlaylist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToDelete }),
    })
      .then((r) => {
        if (r.status === 200) {
          window.location.reload();
        } else {
          alert(`Something went wrong. Server status: ${r.status}`);
        }
      })
      .catch((e) => {
        alert(`Something went wrong. ${JSON.stringify(e)}`);
      });
  };

  try {
    const { playlists, compositions } = prevs;
    return playlists.map((pL) => {
      const { id } = pL;
      const timestring = +pL.name.split("-")[2]; // the part after radio-nachos-
      const timestamp = new Date(timestring);
      let image = "https://www.porknachos.com/files/naviavi.jpg";
      if (pL.images && pL.images.length > 1) {
        image = pL.images[1].url;
      }

      const composition = compositions.filter(
        (comp) => comp.timestamp === timestring.toString()
      )[0];
      const options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      const displayDate = `${timestamp.toLocaleTimeString()}, ${timestamp.toLocaleDateString(
        "en-US",
        options
      )}`;
      if (composition !== undefined) {
        const { compositionData, numberOfTracks } = composition;
        if (!numberOfTracks || numberOfTracks < 1) {
          return (
            <li key={id} className="playlist-entry-wrap">
              <a href={`/radio?timestamp=${timestring}&listId=${id}`}>
                <img src={image} alt="playlist graphic from spotify" />
                <p>An empty playlist</p>
              </a>
              <div className="playlist-buttons">
                <div>&nbsp;</div>
                <button
                  onClick={deletePlaylist}
                  className="delete-playlist-btn"
                  id={`playlist-${id}`}
                >
                  delete this playlist
                </button>
              </div>
              `
            </li>
          );
        }
        return (
          <li key={id} className="playlist-entry-wrap">
            <a href={`/radio?timestamp=${timestring}&listId=${id}`}>
              <img src={image} alt="playlist graphic from spotify" />
              <p>
                {displayDate} - {numberOfTracks} songs
              </p>
            </a>
            {compositionData.map((compo) => (
              <p key={compo.playlistId} className="one-playlist-line">
                {compo.playlistName} ({compo.playlistId})
                <span>{compo.percentage}%</span>
              </p>
            ))}
            <div className="playlist-buttons">
              <button
                className="make-another-btn"
                data-composition={JSON.stringify(compositionData)}
                data-tracks={numberOfTracks}
                onClick={populateForm}
              >
                Set up a similar playlist
              </button>
              <button
                onClick={deletePlaylist}
                className="delete-playlist-btn"
                id={`playlist-${id}`}
              >
                delete this playlist
              </button>
            </div>
            `
          </li>
        );
      } else {
        return (
          <li className="playlist-entry-wrap">
            <a href={`/radio?timestamp=${timestring}&listId=${id}`}>
              <img
                src={`${pL.images[1].url}`}
                alt="playlist graphic from spotify"
              />
              <p>${displayDate}</p>
            </a>
          </li>
        );
      }
    });
  } catch (er) {
    console.log(er, "error mapping playlists");
    return (
      <a href="/">
        Something failed catastrophically. Try logging in again. You might need
        to message me.
      </a>
    );
  }
};
