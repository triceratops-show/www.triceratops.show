// Stop the video when the dialog is closed
const dialog = document.getElementById("video-dialog");

dialog.addEventListener("toggle", (ev) => {
  if (ev.newState === "closed") {
    dialog.querySelectorAll("video").forEach((el) => {
      el.pause();
    });
  }
});
