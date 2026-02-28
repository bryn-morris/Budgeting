function syncMCR() {

  const ss = SpreadsheetApp.getActive();
  const ui = SpreadsheetApp.getUi();

  const mcrSheet = ss.getSheetByName('Master Category Registry');
  const mcrCfgObj = CONFIG_OBJECT.sheets['Master Category Registry'];

  try {

    // SyncMCR to Other Sheets

    // Sync MCR to Google Form
      // Income Categories
      // Expense Categories
      // Pool Categories

    // Cleanup

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

/////////////////////////////////////
//////////////////// HELPERS
/////////////////////////////////////

function syncMCRRowsToSheets_(ss, mcrSheet, mcrCfgObj, readyRows) {
  const processedRows = [];
  
  try {
    for (const row of readyRows) {
      const entry = parseMCRLine_(mcrSheet, row, mcrCfgObj);

      // Skip inactive rows
      if (!entry) continue;

      const targetSheetName = CONFIG_OBJECT.category_mapping[entry.type];
      const targetCfg = CONFIG_OBJECT.sheets[targetSheetName];

      if (!targetSheetName) {
        throw new Error(`MCR row ${row}: unknown type "${entry.type}"`);
      }

      // Skip pools for now
      if (entry.type === "pool") {
        upsetPoolTotalRow_(ss, targetSheetName, targetCfg, entry);
      } else{
        upsertMCRLine_(ss, targetSheetName, targetCfg, entry);
      }

      processedRows.push(row);
    }

    // Mark only successfully processed rows as DONE
    processedRows.forEach(r => {
      mcrSheet.getRange(r, mcrCfgObj.mcr_status_column).setValue("DONE");
    });

    SpreadsheetApp.getUi().alert(`Sync complete.\nProcessed: ${processedRows.length}`);
  } catch (err) {
    throw err;
  }
}

function parseMCRLine_(mcrSheet, row, cfg) {
  const id = String(mcrSheet.getRange(row, cfg.id_column).getValue()).trim();
  const type = String(mcrSheet.getRange(row, cfg.type_column).getValue()).trim().toLowerCase();
  const name = String(mcrSheet.getRange(row, cfg.name_column).getValue()).trim();
  const activeStatus = String(mcrSheet.getRange(row, cfg.active_status_column).getValue()).trim().toLowerCase();
  const formOrder = Number(mcrSheet.getRange(row, cfg.form_order_column).getValue());

  if (activeStatus !== "Y") return null;
  
  if (!id) throw new Error(`MCR row ${row}: missing ID`);
  if (!type) throw new Error(`MCR row ${row}: missing Type`);
  if (!name) throw new Error(`MCR row ${row}: missing Name`);

  return {row, id, type, name, activeStatus, formOrder}
};

function upsertMCRLine_(ss, targetSheetName, targetCfg, upsertData) {
  const sheet = ss.getSheetByName(targetSheetName);
  
  // Need different logic to handle pools

  const target_id_col = targetCfg.category_id_column;
  const target_name_col = targetCfg.category_name_column;
  const target_start_row = targetCfg.table_start_row;
  const target_last_row = sheet.getLastRow();
  const numRows = Math.max(0,target_last_row-target_start_row + 1);

  let existingRow = null;

  if (numRows > 0) {
    const ids = sheet.getRange(target_start_row, target_id_col, numRows, 1).getValues()
      .map(r => String(r[0]).trim());

    const idx = ids.indexOf(upsertData.id);
    if (idx !== -1) existingRow = target_start_row + idx;
  }

  if (existingRow) {
    sheet.getRange(existingRow, target_name_col).setValue(upsertData.name);
  } else {
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, target_id_col).setValue(upsertData.id);
    sheet.getRange(newRow, target_name_col).setValue(upsertData.name);
  }

};