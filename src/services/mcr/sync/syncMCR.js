import { CONFIG_OBJECT } from "../../../config/config.js"
import { syncMCRRowsToSheets_ } from "./sheetUpdate/syncMCRRowsToSheets.js";
import { cleanupMCRSync } from "../cleanup/cleanupMCRSync.js";
import { parseMCRTable } from "./sheetUpdate/parseMCRTable.js";

export function syncMCR() {

  const ss = SpreadsheetApp.getActive();
  const ui = SpreadsheetApp.getUi();

  const mcrSheet = ss.getSheetByName('Master Category Registry');
  const mcrCfgObj = CONFIG_OBJECT.sheets['Master Category Registry'];

  try {

    // Grab data from Ready Rows in MCR Table
    const readyRows = parseMCRTable(mcrSheet, mcrCfgObj);

    // SyncMCR to Other Sheets, return the rows that were processed
    const processedRows = syncMCRRowsToSheets_(ss,mcrSheet, mcrCfgObj, readyRows);

    // Sync MCR to Google Form
      // Income Categories
      // Expense Categories
      // Pool Categories

    SpreadsheetApp.getUi().alert(`Sync complete.\nProcessed: ${processedRows.length}`);

    // Cleanup
    // cleanupMCRSync.js

  } catch (err) {
    ui.alert(`Sync failed.\n${err.message}`);
    throw err;
  }

  // Edit Pool editing entries
};