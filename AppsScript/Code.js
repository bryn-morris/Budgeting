(() => {
  // src/spreadsheet/dateUpdate.js
  function date_update(e) {
    const edited_sheet = e.range.getSheet();
    const config_key = CONFIG_OBJECT.sheets[edited_sheet.getName()];
    if (!config_key || config_key.table_start_row == null || config_key.watch_column == null) return;
    const row = e.range.getRow();
    const col = config_key.date_set_column;
    const numRows2 = e.range.getNumRows();
    edited_sheet.getRange(row, col, numRows2, 1).setValue(Utilities.formatDate(
      /* @__PURE__ */ new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    ));
  }

  // src/config/config.js
  var CONFIG_OBJECT2 = {
    sheets: {
      "": {
        tab_name: ""
      },
      "Recurring Payments (Fixed Monthly Expenses)": {
        tab_name: "Recurring Payments (Fixed Monthly Expenses)",
        watch_column: 6,
        table_start_row: 7,
        date_set_column: 10,
        category_id_column: 3,
        category_name_column: 4
      },
      "Variable Payments (Variable Monthly Expenses)": {
        tab_name: "Variable Payments (Variable Monthly Expenses)",
        watch_column: 4,
        table_start_row: 7,
        date_set_column: 5,
        category_id_column: 2,
        category_name_column: 3
      },
      "Master Category Registry": {
        tab_name: "Master Category Registry",
        mcr_line_start: 3,
        mcr_line_end: 7,
        mcr_table_start_row: 5,
        mcr_status_column: 9,
        id_column: 3,
        type_column: 4,
        name_column: 5,
        form_order_column: 6,
        active_status_column: 7
      },
      "Pools (Budgeted Non-Monthly Expenses)": {
        tab_name: "Pools (Budgeted Non-Monthly Expenses)",
        table_start_row: 4,
        category_id_column: 2,
        category_name_column: 3
      }
    },
    category_mapping: {
      pool: "Pools (Budgeted Non-Monthly Expenses)",
      recurring: "Recurring Payments (Fixed Monthly Expenses)",
      variable: "Variable Payments (Variable Monthly Expenses)"
    }
  };

  // src/services/mcr/status/isMCRRowEmpty.js
  function isMcrRowEmpty_(sheet, row, cfg) {
    const width = cfg.mcr_line_end - cfg.mcr_line_start + 1;
    const values = sheet.getRange(row, cfg.mcr_line_start, 1, width).getValues()[0];
    return values.every((v) => String(v).trim() === "");
  }

  // src/services/mcr/shared/isMCRRowComplete.js
  function isMCRRowComplete_(sheet, row, config_key) {
    const width = config_key.mcr_line_end - config_key.mcr_line_start + 1;
    const values = sheet.getRange(row, config_key.mcr_line_start, 1, width).getValues()[0];
    return values.every((v) => String(v).trim() !== "");
  }

  // src/services/mcr/status/mcrMarkStatus.js
  function mcrMarkStatus(e) {
    const edited_sheet = e.range.getSheet();
    const config_key = CONFIG_OBJECT2.sheets[edited_sheet.getName()];
    const row = e.range.getRow();
    if (!config_key || config_key.mcr_line_start == null || config_key.mcr_line_end == null) return;
    if (row < config_key.mcr_table_start_row) return;
    const colStart = e.range.getColumn();
    const colEnd = colStart + e.range.getNumColumns() - 1;
    const acceptableRange = !(colEnd < config_key.mcr_line_start || colStart > config_key.mcr_line_end);
    if (!acceptableRange) return;
    const statusCell = edited_sheet.getRange(row, config_key.mcr_status_column);
    if (isMcrRowEmpty_(edited_sheet, row, config_key)) {
      statusCell.setValue("");
      return;
    }
    const activeRaw = String(edited_sheet.getRange(row, config_key.active_status_column).getValue()).trim().toUpperCase();
    if (activeRaw !== "Y") {
      statusCell.setValue("INACTIVE");
      return;
    }
    const completionStatus = isMCRRowComplete_(edited_sheet, row, config_key);
    if (!completionStatus) {
      statusCell.setValue("INCOMPLETE");
      return;
    }
    statusCell.setValue("READY TO SYNC");
  }

  // src/triggers/onEdit.js
  function onEdit(e) {
    date_update(e);
    mcrMarkStatus(e);
  }

  // src/services/mcr/sync/sheetUpdate/parseMCRLine.js
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
    return { row, id, type, name, activeStatus, formOrder };
  }

  // src/services/mcr/sync/sheetUpdate/upsertMCRLine.js
  function upsertMCRLine_(ss2, targetSheetName, targetCfg, upsertData) {
    const sheet = ss2.getSheetByName(targetSheetName);
    const target_id_col = targetCfg.category_id_column;
    const target_name_col = targetCfg.category_name_column;
    const target_start_row = targetCfg.table_start_row;
    const target_last_row = sheet.getLastRow();
    const numRows2 = Math.max(0, target_last_row - target_start_row + 1);
    let existingRow = null;
    if (numRows2 > 0) {
      const ids = sheet.getRange(target_start_row, target_id_col, numRows2, 1).getValues().map((r) => String(r[0]).trim());
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
  }

  // src/services/mcr/shared/findPoolsTotalEndRow.js
  function findPoolsTotalEndRow_(sheet, cfg) {
    const startRow = cfg.table_start_row;
    const idCol = cfg.category_id_column;
    const nameCol = cfg.category_name_column;
    const lastRow = sheet.getLastRow();
    if (lastRow < startRow) return startRow - 1;
    const numRows2 = lastRow - startRow + 1;
    const ids = sheet.getRange(startRow, idCol, numRows2, 1).getValues().map((r) => String(r[0]).trim());
    const names = sheet.getRange(startRow, nameCol, numRows2, 1).getValues().map((r) => String(r[0]).trim());
    let lastDataOffset = -1;
    let blankStreak = 0;
    const BLANK_STREAK_TO_STOP = 3;
    for (let i = 0; i < numRows2; i++) {
      const hasData = ids[i] !== "" || names[i] !== "";
      if (hasData) {
        lastDataOffset = i;
        blankStreak = 0;
      } else {
        blankStreak++;
        if (blankStreak >= BLANK_STREAK_TO_STOP && lastDataOffset !== -1) {
          break;
        }
      }
    }
    if (lastDataOffset === -1) return startRow - 1;
    return startRow + lastDataOffset;
  }

  // src/services/mcr/sync/sheetUpdate/upsertPoolTotalRow.js
  function upsertPoolTotalRow_(ss2, poolsSheetName, poolsCfg, entry) {
    const sheet = ss2.getSheetByName(poolsSheetName);
    if (!sheet) throw new Error(`Pools sheet not found: ${poolsSheetName}`);
    const idCol = poolsCfg.category_id_column;
    const nameCol = poolsCfg.category_name_column;
    const startRow = poolsCfg.table_start_row;
    const endRow = findPoolsTotalEndRow_(sheet, poolsCfg);
    let ids = [];
    let names = [];
    if (numRows > 0) {
      ids = sheet.getRange(startRow, idCol, numRows, 1).getValues().map((r) => String(r[0]).trim());
      names = sheet.getRange(startRow, nameCol, numRows, 1).getValues().map((r) => String(r[0]).trim());
    }
    const idx = ids.indexOf(entry.id);
    if (idx !== -1) {
      const existingRow = startRow + idx;
      sheet.getRange(existingRow, nameCol).setValue(entry.name);
      return;
    }
    let insertOffset = -1;
    for (let i = 0; i < numRows; i++) {
      if (!ids[i] && !names[i]) {
        insertOffset = i;
        break;
      }
    }
    if (insertOffset !== -1) {
      const row = startRow + insertOffset;
      sheet.getRange(row, idCol).setValue(entry.id);
      sheet.getRange(row, nameCol).setValue(entry.name);
    } else {
      const row = endRow >= startRow ? endRow + 1 : startRow;
      if (endRow >= startRow) sheet.insertRowAfter(endRow);
      sheet.getRange(row, idCol).setValue(entry.id);
      sheet.getRange(row, nameCol).setValue(entry.name);
    }
  }

  // src/services/mcr/sync/sheetUpdate/syncMCRRowsToSheets.js
  function syncMCRRowsToSheets_(ss2, mcrSheet, mcrCfgObj, readyRows2) {
    const processedRows = [];
    try {
      for (const row of readyRows2) {
        const entry = parseMCRLine_(mcrSheet, row, mcrCfgObj);
        if (!entry) continue;
        const targetSheetName = CONFIG_OBJECT2.category_mapping[entry.type];
        const targetCfg = CONFIG_OBJECT2.sheets[targetSheetName];
        if (!targetSheetName) {
          throw new Error(`MCR row ${row}: unknown type "${entry.type}"`);
        }
        if (entry.type === "pool") {
          upsertPoolTotalRow_(ss2, targetSheetName, targetCfg, entry);
        } else {
          upsertMCRLine_(ss2, targetSheetName, targetCfg, entry);
        }
        processedRows.push(row);
      }
      processedRows.forEach((r) => {
        mcrSheet.getRange(r, mcrCfgObj.mcr_status_column).setValue("DONE");
      });
      return processedRows;
    } catch (err) {
      throw err;
    }
  }

  // src/services/mcr/sync/sheetUpdate/parseMCRTable.js
  function parseMCRTable(mcrSheet, mcrCfgObj) {
    try {
      const startRowPos = mcrCfgObj.mcr_table_start_row;
      const lastRowPos = mcrSheet.getLastRow();
      if (lastRowPos < startRowPos) return;
      const statusCells = mcrSheet.getRange(startRowPos, mcrCfgObj.mcr_status_column, lastRowPos - startRowPos + 1, 1);
      const statusValues = statusCells.getValues();
      const readyRows2 = [];
      statusValues.forEach(
        (r, i) => {
          if (String(r[0]).trim() === "READY TO SYNC") {
            readyRows2.push(startRowPos + i);
          }
          ;
        }
      );
    } catch (err) {
      ui.alert(`Could not parse MCR Table.
${err.message}`);
      throw err;
    }
    if (!readyRows.length) return;
  }

  // src/services/mcr/sync/syncMCR.js
  function syncMCR() {
    const ss2 = SpreadsheetApp.getActive();
    const ui2 = SpreadsheetApp.getUi();
    const mcrSheet = ss2.getSheetByName("Master Category Registry");
    const mcrCfgObj = CONFIG_OBJECT2.sheets["Master Category Registry"];
    try {
      const readyRows2 = parseMCRTable(mcrSheet, mcrCfgObj);
      const processedRows = syncMCRRowsToSheets_(ss2, mcrSheet, mcrCfgObj, readyRows2);
      SpreadsheetApp.getUi().alert(`Sync complete.
Processed: ${processedRows.length}`);
    } catch (err) {
      ui2.alert(`Sync failed.
${err.message}`);
      throw err;
    }
  }

  // src/triggers/runMCRSync.js
  function runMCRSync() {
    syncMCR(ss);
  }

  // src/main.js
  globalThis._onEdit = function(e) {
    return onEdit(e);
  };
  globalThis._runMCRSync = function(e) {
    runMCRSync(e);
  };
  globalThis.CONFIG_OBJECT = CONFIG_OBJECT2;
})();
