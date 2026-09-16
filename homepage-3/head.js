/* Runs before the first paint, loaded synchronously from <head>: marks the
   document as scripted so the entrance styles apply. Without this the
   stylesheet leaves every block visible, so a reader with scripts off sees
   the whole page and never a blank one. */
document.documentElement.className += ' has-js';
