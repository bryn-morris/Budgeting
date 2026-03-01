import { CONFIG_OBJECT } from "../../../config/config.js"
import { syncMCRRowsToSheets_ } from "./syncMCRRowsToSheets.js";
import { cleanupMCRSync } from "../cleanup/cleanupMCRSync.js";
import { parseMCRTable } from "./parseMCRTable.js";

export function syncMCR() {

  const ss = SpreadsheetApp.getActive();
  const ui = SpreadsheetApp.getUi();

  const mcrSheet = ss.getSheetByName('Master Category Registry');
  const mcrCfgObj = CONFIG_OBJECT.sheets['Master Category Registry'];

  try {

    // Grab data from Ready Rows in MCR Table
    const readyRows = parseMCRTable(mcrSheet, mcrCfgObj);

    // SyncMCR to Other Sheets
    syncMCRRowsToSheets_(ss,mcrSheet, mcrCfgObj, readyRows);

    // Sync MCR to Google Form
      // Income Categories
      // Expense Categories
      // Pool Categories

    // Cleanup
    // cleanupMCRSync.js

  } catch (err) {
    ui.alert(`Sync failed.\n${err.message}`);
    throw err;
  }

  // Edit Pool editing entries
  
  // Update form dropdown choices
    // Income Categories, Expense Categories, Pool Categories

};