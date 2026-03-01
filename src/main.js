// Entry point. Everything you want in Google Apps Script must be reachable from here.
// import call functions in to be called 

// import { syncToMcr } from "./syncToMcr.js";
// import { syncFromMcr } from "./syncFromMcr.js";
// import { cleanup } from "./cleanup.js";

// function syncAll() {
//   syncToMcr();
//   syncFromMcr();
//   cleanup();
// }

// globalThis.syncAll = syncAll

import { onEdit } from "./onEdit.js"

globalThis.onEdit = onEdit;