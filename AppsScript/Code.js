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
  function isMcrRowEmpty_(sheet2, row, cfg2) {
    const width = cfg2.mcr_line_end - cfg2.mcr_line_start + 1;
    const values = sheet2.getRange(row, cfg2.mcr_line_start, 1, width).getValues()[0];
    return values.every((v) => String(v).trim() === "");
  }

  // src/services/mcr/shared/isMCRRowComplete.js
  function isMCRRowComplete_(sheet2, row, config_key) {
    const width = config_key.mcr_line_end - config_key.mcr_line_start + 1;
    const values = sheet2.getRange(row, config_key.mcr_line_start, 1, width).getValues()[0];
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
    const activeRaw = String(sheet.getRange(row, cfg.active_status_column).getValue()).trim().toUpperCase();
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

  // src/services/mcr/sync/syncMCR.js
  function syncMCR() {
    const ss2 = SpreadsheetApp.getActive();
    const ui = SpreadsheetApp.getUi();
    const mcrSheet = ss2.getSheetByName("Master Category Registry");
    const mcrCfgObj = CONFIG_OBJECT2.sheets["Master Category Registry"];
    try {
    } catch (err) {
      ui.alert(`Sync failed.
${err.message}`);
      throw err;
    }
    const startRowPos = mcrCfgObj.mcr_table_start_row;
    const lastRowPos = mcrSheet.getLastRow();
    if (lastRowPos < startRowPos) return;
    const statusCells = mcrSheet.getRange(startRowPos, mcrCfgObj.mcr_status_column, lastRowPos - startRowPos + 1, 1);
    const statusValues = statusCells.getValues();
    const readyRows = [];
    statusValues.forEach(
      (r, i) => {
        if (String(r[0]).trim() === "READY TO SYNC") {
          readyRows.push(startRowPos + i);
        }
        ;
      }
    );
    if (!readyRows.length) return;
  }

  // src/triggers/runMCRSync.js
  function runMCRSync() {
    syncMCR(ss);
  }

  // src/main.js
  globalThis.onEdit = onEdit;
  globalThis.runMCRSync = runMCRSync;
})();
