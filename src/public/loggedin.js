const form = document.getElementById("creator-form");
const addButton1 = document.getElementById("add-entry-button-1");
const total = document.getElementById("total");
const allEntries = document.getElementById("all-entries");
const reset = document.getElementById("reset");
const submitBtn = document.getElementById("submit-btn");
const ul = document.getElementById("previous");
const h2 = document.getElementsByTagName("h2")[0];
const playlist1 = document.getElementById("playlist1");
const trackInput = document.getElementById("tracks-input");
const tracksCount = document.getElementById("currentVal");
// here's a weird one - a func, not const-var
const arr = () => Array.from(document.getElementsByClassName("percentage"));

function getPlaylists() {
  fetch("/getPrev")
    .then((res) => res.json())
    .then(({ playlists, compositions, error }) => {
      const nope = document.getElementById("nope");
      if (error) {
        form.classList.add("visually-hidden");
        h2.classList.add("visually-hidden");
        return (nope.innerText = error);
      }
      if (playlists.length > 0) nope.innerText = "";
      playlists.forEach((pL) => {
        const { id } = pL;
        const timestring = +pL.name.split("-")[2]; // the part after radio-nachos-
        const timestamp = new Date(timestring);
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
        const li = document.createElement("li");
        li.classList.add("playlist-entry-wrap");
        if (composition !== undefined) {
          const { compositionData, numberOfTracks } = composition;
          const compositionHTML = compositionData
            .map((compo) => {
              return `<p class="one-playlist-line">${compo.playlistName} (${compo.playlistId})<span>${compo.percentage}%</span></p>`;
            })
            .join("");
          li.innerHTML = `
            <a href="/radio?timestamp=${timestring}&listId=${id}">
              <img src="${pL.images[1].url}" />
              <p>${displayDate}</p>
            </a>
            ${compositionHTML}
            `;
        } else {
          li.innerHTML = `<a href="/radio?timestamp=${timestring}&listId=${id}">
          <img src="${pL.images[1].url}" />
          <p>${displayDate}</p>
        </a>`;
        }
        ul.appendChild(li);
      });
    })
    .catch((e) => console.log(e));
}

function validate(obj) {
  if (total.innerText !== "100") return "I'm not 100% satisfied, Brad.";
  const keys = Object.keys(obj);
  const length = keys.length / 2;
  const array = [];
  for (var i = 0; i < length; i++) {
    const playlistName = obj[`playlist${i + 1}`].replace(
      "spotify:playlist:",
      ""
    );
    if (playlistName !== "" && obj[`percent${i + 1}`] !== "") {
      array.push([playlistName, +obj[`percent${i + 1}`]]);
    }
  }
  if (array.length !== length) return "We have a problem.";
  return array;
}
function handleSubmit(e) {
  e.preventDefault();
  const reqBody = {};
  Object.keys(form.elements).forEach((key) => {
    let element = form.elements[key];
    if (element.type === "text" || element.type === "number") {
      reqBody[element.name] = element.value;
    }
  });
  const validated = validate(reqBody);
  if (typeof validated === "string") {
    console.log(validated);
  } else {
    fetch("/make", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        arrayOfArrays: validated,
        numberOfTracks: +tracksCount.innerText,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const { listId, timestamp } = json;
        const url = new URL(window.location.href);
        return (window.location.href = `${url.origin}/radio?listId=${listId}&timestamp=${timestamp}`);
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
function attemptNameLookup(ev, num) {
  try {
    const el = document.getElementById(`playlist${num}-name-lookup`);
    const str = ev.target.value;
    if (!str.match(/^spotify:playlist:[a-zA-Z0-9]{22}$/)) {
      el.innerText = "invalid code. is that a playlist?";
    } else {
      // network lookup
      fetch("/playlistlookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ str }),
      })
        .then((r) => r.json())
        .then(({ error, name }) => {
          console.log(error, name);
          if (name && !error) {
            el.innerText = name;
          }
        })
        .catch((e) => console.log(e));
    }
  } catch {
    console.log("error attempting lookup of playlist name");
  }
}
function makeHtml(num) {
  const label1 = document.createElement("label");
  label1.setAttribute("for", `playlist${num}`);
  label1.innerText = "playlist ID";
  const input1 = document.createElement("input");
  input1.setAttribute("type", "text");
  input1.setAttribute("name", `playlist${num}`);
  input1.addEventListener("change", (e) => attemptNameLookup(e, num));
  input1.classList.add("playlist-id");
  input1.setAttribute("data-lpignore", "true");
  input1.setAttribute("required", true);
  const label2 = document.createElement("label");
  label2.setAttribute("for", `percent{num}`);
  label2.innerText = "%";
  const input2 = document.createElement("input");
  input2.classList.add("percentage");
  input2.setAttribute("type", "number");
  input2.setAttribute("min", "1");
  input2.setAttribute("max", "100");
  input2.setAttribute("step", "1");
  input2.setAttribute("name", `percent${num}`);
  const p = document.createElement("p");
  p.setAttribute("id", `playlist${num}-name-lookup`);
  const btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.setAttribute("id", `add-entry-button-${num}`);
  btn.classList.add("add-entry-button");
  btn.value = num;
  btn.innerText = "add more";
  return [label1, input1, input2, label2, btn, p];
}
function sumTotal() {
  let sum = 0;
  arr().forEach((p) => (sum += +p.value)); // weird func, used.
  total.innerText = sum;
}
function addChangeHandlerToPercs() {
  arr().forEach((a) => {
    a.removeEventListener("change", (ev) => sumTotal());
    a.addEventListener("change", (ev) => sumTotal());
  });
}
function handleAddButton(e, resetToggle) {
  e.preventDefault();
  currentCount = +e.target.value;
  if (!resetToggle) {
    document
      .getElementById(`add-entry-button-${currentCount}`)
      .classList.add("visually-hidden");
  }
  const newLookup = document.createElement("div");
  newLookup.classList.add("above-entry-wrap");
  newSpacer = document.createElement("p");
  newSpacer.classList.add("label-spacer");
  newP = document.createElement("p");
  newP.classList.add("playlist-name-lookup");
  newP.setAttribute("id", `playlist${currentCount + 1}-name-lookup`);
  newLookup.append(newSpacer, newP);
  const newEntry = document.createElement("div");
  const eles = makeHtml(resetToggle ? 1 : currentCount + 1);
  newEntry.classList.add("one-entry-wrap");
  newEntry.append(...eles);
  allEntries.appendChild(newLookup);
  allEntries.appendChild(newEntry);
  document
    .getElementById(`add-entry-button-${resetToggle ? 1 : currentCount + 1}`)
    .addEventListener("click", handleAddButton);
  addChangeHandlerToPercs();
}

/* okay, funcs are all set. add immediate listeners and call funcs */
reset.addEventListener("click", (e) => {
  while (allEntries.hasChildNodes()) {
    allEntries.removeChild(allEntries.lastChild);
  }
  total.innerText = 0;
  handleAddButton(e, true);
});
playlist1.addEventListener("change", (e) => attemptNameLookup(e, 1));
submitBtn.addEventListener("click", handleSubmit);
addButton1.addEventListener("click", (e) => handleAddButton(e, false));
addChangeHandlerToPercs();
sumTotal(arr()); // weird func, used.
getPlaylists();

trackInput.addEventListener("input", (ev) => {
  tracksCount.innerText = ev.target.value;
});
