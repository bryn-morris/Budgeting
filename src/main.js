// Entry point. Everything you want in Google Apps Script must be reachable from here.
// import call functions in to be called 

import { onEdit } from "./triggers/onEdit.js"
import { runMCRSync } from "./triggers/runMCRSync.js"
import { CONFIG_OBJECT } from "./config/config.js";
import { onAddMCRRow } from "./triggers/onAddMCRRow.js";

globalThis._onEdit = function (e) {
    return onEdit(e)
};
globalThis._runMCRSync = function (e) {
    runMCRSync(e)
};

globalThis._onAddMCRRow = function (e) {
    onAddMCRRow(e)
};

globalThis.CONFIG_OBJECT = CONFIG_OBJECT;