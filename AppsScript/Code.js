(() => {
  // src/onEdit.js
  function onEdit(e) {
    date_update(e);
    mcrMarkStatus(e);
  }

  // src/main.js
  globalThis.onEdit = onEdit;
})();
