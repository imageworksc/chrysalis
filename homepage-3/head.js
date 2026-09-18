/* Runs before the first paint, loaded synchronously from <head>: marks the
   document as scripted so the entrance styles apply. Without this the
   stylesheet leaves every block visible, so a reader with scripts off sees
   the whole page and never a blank one. */
document.documentElement.className += ' has-js';

/* And the failsafe: main.js marks the document reveal-ready as it starts. If
   that mark is still missing four seconds in, the script was blocked or lost,
   and reveal-off shows every block rather than leave the page hidden. */
window.setTimeout(() => {
  const root = document.documentElement;
  if (!root.classList.contains('reveal-ready')) root.classList.add('reveal-off');
}, 4000);
