import React from "react";

export default function (
  num,
  array,
  handleInputChange,
  addFormLine,
  removeFormLine,
  isLast = false,
  isOnly = true
) {
  // console.log(num, array);
  return (
    <div key={num}>
      <div className="above-entry-wrap">
        <p className="label-spacer"></p>
        <p className="playlist-name-lookup" id="playlist1-name-lookup">
          {array[2]}
        </p>
      </div>
      <div className="one-entry-wrap">
        <label htmlFor={`playlist${num}`}>playlist ID</label>
        <input
          type="text"
          name={`playlist${num}`}
          id={`playlist${num}`}
          className="playlist-id"
          data-lpignore="true"
          required
          placeholder="spotify:playlist:37i9dQZF1DZ06evO05tE88"
          value={array[0]}
          onChange={handleInputChange}
        />
        <input
          type="number"
          className="percentage"
          id={`percent${num}`}
          name={`percent${num}`}
          value={array[1]}
          min="1"
          max="100"
          step="1"
          onChange={handleInputChange}
        />
        <label htmlFor={`percent${num}`}>%</label>
        <button
          type="button"
          className={`add-entry-button ${!isLast ? "visually-hidden" : ""}`}
          id={`add-entry-button-${num}`}
          value={num}
          onClick={addFormLine}
        >
          add more
        </button>

        {!isOnly && (
          <button
            type="button"
            className="remove-entry-button"
            id={`remove-entry-button-${num}`}
            value={num}
            onClick={removeFormLine}
          >
            remove this
          </button>
        )}
      </div>
    </div>
  );
}
