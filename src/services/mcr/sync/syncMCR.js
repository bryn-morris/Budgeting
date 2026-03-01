import { CONFIG_OBJECT } from "../../../config/config.js"
import { syncMCRRowsToSheets_ } from "./syncMCRRowsToSheets.js";
import { cleanupMCRSync } from "../cleanup/cleanupMCRSync.js";


export function syncMCR() {

  const ss = SpreadsheetApp.getActive();
  const ui = SpreadsheetApp.getUi();

  const mcrSheet = ss.getSheetByName('Master Category Registry');
  const mcrCfgObj = CONFIG_OBJECT.sheets['Master Category Registry'];

  try {

    // SyncMCR to Other Sheets
    // syncMCRRowsToSheets_

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

  const startRowPos = mcrCfgObj.mcr_table_start_row;
  const lastRowPos = mcrSheet.getLastRow();

  //If table has no entries, abort
  if(lastRowPos < startRowPos) return;

  // Grab Status Values from Status Column
  const statusCells = mcrSheet.getRange(startRowPos, mcrCfgObj.mcr_status_column, lastRowPos-startRowPos+1, 1);
  const statusValues = statusCells.getValues();

  //Grab the row numbers for any rows marked as "READY TO SYNC"
  //**ROOM TO ITERATE ON USING A SIMPLE ARRAY FOR DATA STORAGE */
  const readyRows = [];
  statusValues.forEach(
    (r,i)=>{
      // grab text but remove whitespace
      // compare against ready to sync string
      // add row value to readyRows array
      if(String(r[0]).trim() === "READY TO SYNC"){
        readyRows.push(startRowPos + i)
      };
    }
  );

  // Abort if there are no categories in "READY TO SYNC"
  //**REFINE TO USE TRY BLOCKS AND THROW ERRORS */
  if(!readyRows.length) return; 



  // Edit Pool editing entries
  
  // Update form dropdown choices
    // Income Categories, Expense Categories, Pool Categories

};