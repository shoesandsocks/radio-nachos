export default (str, num, submission, setSubmission, displayError) => {
  fetch("/playlistlookup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ str }),
  })
    .then((r) => r.json())
    .then(({ error, name }) => {
      displayError(error);
      const newSub = [...submission];
      newSub[num][2] = name ? name : "";
      return setSubmission(newSub);
    })
    .catch((e) => displayError("Lookup failed. Are you logged in?"));
};
