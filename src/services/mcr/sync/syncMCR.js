import { CONFIG_OBJECT } from "../../../config/config.js"
import { syncMCRRowsToSheets_ } from "./sheetUpdate/syncMCRRowsToSheets.js";
import { cleanupMCRSync } from "../cleanup/cleanupMCRSync.js";
import { parseMCRTable } from "./sheetUpdate/parseMCRTable.js";
import { syncMRCRowsToForm } from "./formUpsert/syncMCRRowsToForm.js";

export function syncMCR() {

  const ss = SpreadsheetApp.getActive();
  const ui = SpreadsheetApp.getUi();

  const mcrSheet = ss.getSheetByName('Master Category Registry');
  const mcrCfgObj = CONFIG_OBJECT.sheets['Master Category Registry'];

  try {

    // Grab data from Ready Rows in MCR Table
    const readyRows = parseMCRTable(ui, mcrSheet, mcrCfgObj);

    // SyncMCR to Other Sheets, return the rows that were processed
    const processedRows = syncMCRRowsToSheets_(ss,mcrSheet, mcrCfgObj, readyRows);

    // SyncMCR rows to Form
    syncMRCRowsToForm(ss, ui, mcrSheet, mcrCfgObj);

    // Cleanup
    cleanupMCRSync(ss, mcrCfgObj, mcrSheet);

    SpreadsheetApp.getUi().alert(`Sync complete.\nProcessed: ${processedRows.length}`);

  } catch (err) {
    ui.alert(`Sync failed.\n${err.message}`);
    throw err;
  }
};