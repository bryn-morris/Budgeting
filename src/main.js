// Entry point. Everything you want in Google Apps Script must be reachable from here.
// import call functions in to be called 

import { onEdit } from "./triggers/onEdit.js"
import { runMCRSync } from "./triggers/runMCRSync.js"

globalThis.onEdit = onEdit;
globalThis.runMCRSync = runMCRSync;