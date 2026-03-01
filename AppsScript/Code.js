(() => {
  // src/spreadsheet/dateUpdate.js
  function date_update(e) {
    const edited_sheet = e.range.getSheet();
    const config_key = CONFIG_OBJECT.sheets[edited_sheet.getName()];
    if (!config_key || config_key.table_start_row == null || config_key.watch_column == null) return;
    const row = e.range.getRow();
    const date_col = config_key.date_set_column;
    const id_col = config_key.category_id_column;
    const numRows = e.range.getNumRows();
    const idCell = edited_sheet.getRange(row, id_col, numRows, 1);
    console.log(`RowValue:: ${row}`);
    if (idCell.getValue()) {
      edited_sheet.getRange(row, date_col, numRows, 1).setValue(Utilities.formatDate(
        /* @__PURE__ */ new Date(),
        Session.getScriptTimeZone(),
        "yyyy-MM-dd"
      ));
    }
    edited_sheet.getRange(row, date_col, numRows, 1).setValue("");
    return;
  }

  // src/config/config.js
  var CONFIG_OBJECT2 = {
    form: {
      form_id: "1WT_DkTsPOZ6Ys_DCVxdJtIcyTnLhCwYIs7Xl3cyZHk0",
      dropdown_ids: {
        expense_category: "752519196",
        expense_pools_category: "1067936705",
        income_category: "658637086",
        pool_funding_category: "1777025688"
      }
    },
    sheets: {
      "Income Review": {
        tab_name: "Income Review",
        watch_column: 4,
        table_start_row: 7,
        date_set_column: 5,
        category_id_column: 2,
        category_name_column: 3
      },
      "Recurring Payments (Fixed Monthly Expenses)": {
        tab_name: "Recurring Payments (Fixed Monthly Expenses)",
        watch_column: 6,
        table_start_row: 7,
        date_set_column: 10,
        category_id_column: 3,
        category_name_column: 4,
        autopay_column: 8
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
        watch_column: null,
        table_start_row: 5,
        date_set_column: null,
        category_id_column: 3,
        category_name_column: 5,
        mcr_line_start: 3,
        mcr_line_end: 7,
        mcr_status_column: 9,
        type_column: 4,
        form_order_column: 6,
        active_status_column: 7
      },
      "Pools (Budgeted Non-Monthly Expenses)": {
        tab_name: "Pools (Budgeted Non-Monthly Expenses)",
        table_start_row: 4,
        category_id_column: 2,
        category_name_column: 3,
        current_balance: 6
      }
    },
    category_mapping: {
      pool: "Pools (Budgeted Non-Monthly Expenses)",
      recurring: "Recurring Payments (Fixed Monthly Expenses)",
      variable: "Variable Payments (Variable Monthly Expenses)",
      income: "Income Review"
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
    if (row < config_key.table_start_row) return;
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
    const id = String(mcrSheet.getRange(row, cfg.category_id_column).getValue()).trim();
    const type = String(mcrSheet.getRange(row, cfg.type_column).getValue()).trim().toLowerCase();
    const name = String(mcrSheet.getRange(row, cfg.category_name_column).getValue()).trim();
    const activeStatus = String(mcrSheet.getRange(row, cfg.active_status_column).getValue()).trim().toLowerCase();
    const formOrder = Number(mcrSheet.getRange(row, cfg.form_order_column).getValue());
    if (activeStatus !== "y") return null;
    if (!id) throw new Error(`MCR row ${row}: missing ID`);
    if (!type) throw new Error(`MCR row ${row}: missing Type`);
    if (!name) throw new Error(`MCR row ${row}: missing Name`);
    return { row, id, type, name, activeStatus, formOrder };
  }

  // src/services/mcr/shared/getLastRowofTable.js
  function getLastRowofTable_(sheet, targetConfig) {
    const startRow = targetConfig.table_start_row;
    const idCol = targetConfig.category_id_column;
    const capLast = sheet.getLastRow();
    if (capLast < startRow) return startRow - 1;
    const idVals = sheet.getRange(startRow, idCol, capLast - startRow + 1, 1).getValues();
    let count = 0;
    for (let i = 0; i < idVals.length; i++) {
      const id = String(idVals[i][0] ?? "").trim();
      if (!id) break;
      count++;
    }
    const lastRow = startRow + count - 1;
    return lastRow;
  }

  // src/services/mcr/sync/sheetUpdate/upsertMCRLine.js
  function upsertMCRLine_(ss, targetSheetName, targetCfg, upsertData) {
    const sheet = ss.getSheetByName(targetSheetName);
    const target_id_col = targetCfg.category_id_column;
    const target_name_col = targetCfg.category_name_column;
    const target_start_row = targetCfg.table_start_row;
    const target_last_row = getLastRowofTable_(sheet, targetCfg);
    const numRows = Math.max(0, target_last_row - target_start_row + 1);
    let existingRow = null;
    if (numRows > 0) {
      const ids = sheet.getRange(target_start_row, target_id_col, numRows, 1).getValues().map((r) => String(r[0]).trim());
      const idx = ids.indexOf(upsertData.id);
      if (idx !== -1) existingRow = target_start_row + idx;
    }
    if (existingRow) {
      sheet.getRange(existingRow, target_name_col).setValue(upsertData.name);
    } else {
      const newRow = getLastRowofTable_(sheet, targetCfg) + 1;
      sheet.getRange(newRow, target_id_col).setValue(upsertData.id);
      sheet.getRange(newRow, target_name_col).setValue(upsertData.name);
    }
  }

  // src/services/mcr/sync/sheetUpdate/upsertPoolTotalRow.js
  function upsertPoolTotalRow_(ss, poolsSheetName, poolsCfg, entry) {
    const sheet = ss.getSheetByName(poolsSheetName);
    if (!sheet) throw new Error(`Pools sheet not found: ${poolsSheetName}`);
    const idCol = poolsCfg.category_id_column;
    const nameCol = poolsCfg.category_name_column;
    const startRow = poolsCfg.table_start_row;
    const lastRow = getLastRowofTable_(sheet, poolsCfg);
    const numRows = Math.max(0, lastRow - startRow + 1);
    const endRow = getLastRowofTable_(sheet, poolsCfg);
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
  function syncMCRRowsToSheets_(ss, mcrSheet, mcrCfgObj, readyRows) {
    const processedRows = [];
    try {
      for (const row of readyRows) {
        const entry = parseMCRLine_(mcrSheet, row, mcrCfgObj);
        if (!entry) continue;
        const targetSheetName = CONFIG_OBJECT2.category_mapping[entry.type];
        const targetCfg = CONFIG_OBJECT2.sheets[targetSheetName];
        if (!targetSheetName) {
          throw new Error(`MCR row ${row}: unknown type "${entry.type}"`);
        }
        if (entry.type === "pool") {
          upsertPoolTotalRow_(ss, targetSheetName, targetCfg, entry);
        } else {
          upsertMCRLine_(ss, targetSheetName, targetCfg, entry);
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

  // src/services/mcr/cleanup/cleanupTargetTable.js
  function cleanupTargetTable_(targetSheet, targetValidIDSet) {
    const targetSheetName = targetSheet.getName();
    const targetConfig = CONFIG_OBJECT2.sheets[targetSheetName];
    const startRow = targetConfig.table_start_row;
    const lastRow = getLastRowofTable_(targetSheet, targetConfig);
    const idCol = targetConfig.category_id_column;
    const numRows = Math.max(0, lastRow - startRow + 1);
    if (numRows === 0) return 0;
    const rawTargetSheetIds = targetSheet.getRange(startRow, idCol, numRows, 1).getValues();
    const normalizedTargetIDs = rawTargetSheetIds.map(
      (r) => String(r[0]).trim()
    );
    let deletedRowsCount = 0;
    for (let i = normalizedTargetIDs.length - 1; i >= 0; i--) {
      const rowId = normalizedTargetIDs[i];
      if (!rowId) continue;
      if (!targetValidIDSet.has(rowId)) {
        targetSheet.deleteRow(startRow + i);
        deletedRowsCount++;
      }
    }
    return deletedRowsCount;
  }

  // src/services/mcr/cleanup/getValidIDSetByMCRType.js
  function getValidIDSetByMCRType_(mcrSheet, mcrConfig) {
    const startRow = mcrConfig.table_start_row;
    const lastRow = getLastRowofTable_(mcrSheet, mcrConfig);
    const validIDObj = {
      recurring: /* @__PURE__ */ new Set(),
      variable: /* @__PURE__ */ new Set(),
      pool: /* @__PURE__ */ new Set(),
      income: /* @__PURE__ */ new Set()
    };
    if (lastRow < startRow) {
      return validIDObj;
    }
    for (let r = startRow; r <= lastRow; r++) {
      const id = String(
        mcrSheet.getRange(r, mcrConfig.category_id_column).getValue()
      ).trim();
      if (!id) continue;
      const active = String(
        mcrSheet.getRange(r, mcrConfig.active_status_column).getValue()
      ).trim().toUpperCase();
      if (active !== "Y") continue;
      if (!isMCRRowComplete_(mcrSheet, r, mcrConfig)) continue;
      const rowType = String(
        mcrSheet.getRange(r, mcrConfig.type_column).getValue()
      ).trim().toLowerCase();
      if (!validIDObj[rowType]) continue;
      validIDObj[rowType].add(id);
    }
    return validIDObj;
  }

  // src/services/mcr/cleanup/cleanupMCRSync.js
  function cleanupMCRSync(ss, mcrConfig, mcrSheet) {
    const {
      recurring: validRecurringIds,
      variable: validVariableIds,
      pool: validPoolIds,
      income: validIncomeIds
    } = getValidIDSetByMCRType_(mcrSheet, mcrConfig);
    let deletedEntries = 0;
    const incomeConfig = CONFIG_OBJECT2.sheets[CONFIG_OBJECT2.category_mapping.variable];
    const incomeSheet = ss.getSheetByName(incomeConfig.tab_name);
    deletedEntries += cleanupTargetTable_(incomeSheet, validIncomeIds);
    const recurringConfig = CONFIG_OBJECT2.sheets[CONFIG_OBJECT2.category_mapping.recurring];
    const recurringSheet = ss.getSheetByName(recurringConfig.tab_name);
    deletedEntries += cleanupTargetTable_(recurringSheet, validRecurringIds);
    const variableConfig = CONFIG_OBJECT2.sheets[CONFIG_OBJECT2.category_mapping.variable];
    const variableSheet = ss.getSheetByName(variableConfig.tab_name);
    deletedEntries += cleanupTargetTable_(variableSheet, validVariableIds);
    const poolConfig = CONFIG_OBJECT2.sheets[CONFIG_OBJECT2.category_mapping.pool];
    const poolSheet = ss.getSheetByName(poolConfig.tab_name);
    deletedEntries += cleanupTargetTable_(poolSheet, validPoolIds);
    SpreadsheetApp.getActive().toast(
      `Cleanup complete: ${deletedEntries} rows removed.`,
      "MCR Sync",
      5
      // seconds
    );
  }

  // src/services/mcr/sync/sheetUpdate/parseMCRTable.js
  function parseMCRTable(ui, mcrSheet, mcrCfgObj) {
    const readyRows = [];
    try {
      const startRowPos = mcrCfgObj.table_start_row;
      const status_column_id = mcrCfgObj.mcr_status_column;
      const lastRowPos = getLastRowofTable_(mcrSheet, mcrCfgObj);
      if (lastRowPos < startRowPos) return;
      const statusCells = mcrSheet.getRange(startRowPos, status_column_id, lastRowPos - startRowPos + 1, 1);
      const statusValues = statusCells.getValues();
      statusValues.forEach(
        (r, i) => {
          if (String(r[0]).trim() === "READY TO SYNC") {
            readyRows.push(startRowPos + i);
          }
          ;
        }
      );
    } catch (err) {
      ui.alert(`Could not parse MCR Table.
${err.message}`);
      throw err;
    }
    if (!readyRows.length) return [];
    return readyRows;
  }

  // src/services/mcr/sync/formUpsert/buildRecurringAutopayIndex.js
  function buildRecurringAutopayIndex_(ss, recurringCfg) {
    const sheet = ss.getSheetByName(recurringCfg.tab_name);
    if (!sheet) throw new Error(`Missing sheet: "${recurringCfg.tab_name}"`);
    const startRow = recurringCfg.table_start_row;
    const lastRow = getLastRowofTable_(sheet, recurringCfg);
    if (lastRow < startRow) return /* @__PURE__ */ new Map();
    const numRows = lastRow - startRow + 1;
    const idVals = sheet.getRange(startRow, recurringCfg.category_id_column, numRows, 1).getValues();
    const apVals = sheet.getRange(startRow, recurringCfg.autopay_column, numRows, 1).getValues();
    const idx = /* @__PURE__ */ new Map();
    for (let i = 0; i < numRows; i++) {
      const id = String(idVals[i][0] ?? "").trim();
      if (!id) continue;
      const autopay = String(apVals[i][0] ?? "").trim().toUpperCase() === "Y";
      idx.set(id, autopay);
    }
    return idx;
  }

  // src/services/mcr/sync/formUpsert/getActiveMCRbyType.js
  function getActiveMcrByType_(ss, mcrSheet, cfg) {
    const startRow = cfg.table_start_row;
    const lastRow = getLastRowofTable_(mcrSheet, cfg);
    const out = { recurring: [], variable: [], pool: [], income: [] };
    if (lastRow < startRow) return out;
    const recurringCfg = CONFIG_OBJECT.sheets["Recurring Payments (Fixed Monthly Expenses)"];
    const autopayById = recurringCfg ? buildRecurringAutopayIndex_(ss, recurringCfg) : /* @__PURE__ */ new Map();
    const width = cfg.mcr_line_end - cfg.mcr_line_start + 1;
    const rows = mcrSheet.getRange(startRow, cfg.mcr_line_start, lastRow - startRow + 1, width).getValues();
    const idxId = cfg.category_id_column - cfg.mcr_line_start;
    const idxType = cfg.type_column - cfg.mcr_line_start;
    const idxName = cfg.category_name_column - cfg.mcr_line_start;
    const idxOrder = cfg.form_order_column - cfg.mcr_line_start;
    const idxActive = cfg.active_status_column - cfg.mcr_line_start;
    rows.forEach((r) => {
      const active = String(r[idxActive] ?? "").trim().toUpperCase();
      if (active !== "Y") return;
      const id = String(r[idxId] ?? "").trim();
      const type = String(r[idxType] ?? "").trim().toLowerCase();
      const name = String(r[idxName] ?? "").trim();
      const orderRaw = r[idxOrder];
      if (!id || !name) return;
      if (!out[type]) return;
      if (type === "recurring" && autopayById.get(id) === true) {
        return;
      }
      const order = Number(orderRaw);
      out[type].push({
        id,
        name,
        order: Number.isFinite(order) ? order : 9999
      });
    });
    Object.keys(out).forEach((k) => {
      out[k].sort(
        (a, b) => a.order - b.order || a.name.localeCompare(b.name)
      );
    });
    return out;
  }

  // src/services/mcr/sync/formUpsert/getPoolBalancesById.js
  function getPoolBalancesById_(ss) {
    const poolsSheetName = CONFIG_OBJECT.sheets[CONFIG_OBJECT.category_mapping.pool].tab_name;
    const cfg = CONFIG_OBJECT.sheets[poolsSheetName];
    const sheet = ss.getSheetByName(poolsSheetName);
    if (!sheet) {
      throw new Error(`Pools sheet not found: ${poolsSheetName}`);
    }
    const startRow = cfg.table_start_row;
    const lastRow = getLastRowofTable_(sheet, cfg);
    if (!lastRow || lastRow < startRow) {
      return /* @__PURE__ */ new Map();
    }
    const numRows = lastRow - startRow + 1;
    const ids = sheet.getRange(startRow, cfg.category_id_column, numRows, 1).getDisplayValues().map((r) => String(r[0]).trim());
    const balances = sheet.getRange(startRow, cfg.current_balance, numRows, 1).getDisplayValues().map((r) => String(r[0]).trim());
    const map = /* @__PURE__ */ new Map();
    for (let i = 0; i < numRows; i++) {
      const id = ids[i];
      const bal = balances[i];
      if (!id) continue;
      map.set(id, bal);
    }
    return map;
  }

  // src/services/mcr/sync/formUpsert/constructor/expenseCategoryConstructor.js
  function expenseCategoryConstructor(mcrByType) {
    const expenseArray = [
      ...mcrByType.recurring.map((x) => ({ ...x, type: "recurring" })),
      ...mcrByType.variable.map((x) => ({ ...x, type: "variable" }))
    ];
    expenseArray.sort((a, b) => {
      const d = (a.order ?? 9999) - (b.order ?? 9999);
      if (d !== 0) return d;
    });
    return expenseArray.map((x) => {
      const icon = x.type === "recurring" ? "\u{1F501}" : "\u{1F7E1}";
      return `${icon} ${x.name}`;
    });
  }

  // src/services/mcr/sync/formUpsert/constructor/incomeCategoryCosntructor.js
  function incomeCategoryConstructor(mcrByType) {
    const arr = [...mcrByType.income || []];
    arr.sort((a, b) => {
      const d = (a.order ?? 9999) - (b.order ?? 9999);
      if (d !== 0) return d;
    });
    return arr.map((x) => `\u{1F7E2} ${x.name}`);
  }

  // src/services/mcr/sync/formUpsert/constructor/poolCategoryConstructor.js
  function poolsCategoryConstructor(mcrByType, poolBalancesById) {
    const arr = [...mcrByType.pool || []];
    arr.sort((a, b) => {
      const d = (a.order ?? 9999) - (b.order ?? 9999);
      if (d !== 0) return d;
    });
    return arr.map((x) => {
      const bal = poolBalancesById?.get(x.id);
      return bal ? `\u{1F535} ${x.name} \u2014 ${bal}` : `\u{1F535} ${x.name}`;
    });
  }

  // src/services/mcr/sync/formUpsert/setDropdownChoicesByItemId.js
  function setDropdownChoicesByItemId(form, itemId, choices) {
    const idNum = Number(itemId);
    if (!idNum) throw new Error(`Invalid form itemId: ${itemId}`);
    const item = form.getItemById(idNum);
    if (!item) throw new Error(`Form item not found: itemId=${itemId}`);
    item.asListItem().setChoiceValues(choices);
  }

  // src/services/mcr/sync/formUpsert/syncMCRRowsToForm.js
  function syncMRCRowsToForm(ss, ui, mcrSheet, mcrCfgObj) {
    const formCfg = CONFIG_OBJECT.form;
    const ids = formCfg.dropdown_ids;
    const form = FormApp.openById(formCfg.form_id);
    try {
      const formDataByType = getActiveMcrByType_(ss, mcrSheet, mcrCfgObj);
      const poolIdBalMap = getPoolBalancesById_(ss);
      const expenseCatArray = expenseCategoryConstructor(formDataByType);
      const incomeCatArray = incomeCategoryConstructor(formDataByType);
      const poolsCatArray = poolsCategoryConstructor(formDataByType, poolIdBalMap);
      setDropdownChoicesByItemId(form, ids.expense_category, expenseCatArray);
      setDropdownChoicesByItemId(form, ids.income_category, incomeCatArray);
      setDropdownChoicesByItemId(form, ids.expense_pools_category, poolsCatArray);
      setDropdownChoicesByItemId(form, ids.pool_funding_category, poolsCatArray);
    } catch (err) {
      ui.alert(`Form Category Sync failed.
${err.message}`);
      throw err;
    }
    ;
  }

  // src/services/mcr/sync/syncMCR.js
  function syncMCR() {
    const ss = SpreadsheetApp.getActive();
    const ui = SpreadsheetApp.getUi();
    const mcrSheet = ss.getSheetByName("Master Category Registry");
    const mcrCfgObj = CONFIG_OBJECT2.sheets["Master Category Registry"];
    try {
      const readyRows = parseMCRTable(ui, mcrSheet, mcrCfgObj);
      const processedRows = syncMCRRowsToSheets_(ss, mcrSheet, mcrCfgObj, readyRows);
      syncMRCRowsToForm(ss, ui, mcrSheet, mcrCfgObj);
      cleanupMCRSync(ss, mcrCfgObj, mcrSheet);
      SpreadsheetApp.getUi().alert(`Sync complete.
Processed: ${processedRows.length}`);
    } catch (err) {
      ui.alert(`Sync failed.
${err.message}`);
      throw err;
    }
  }

  // src/triggers/runMCRSync.js
  function runMCRSync() {
    syncMCR();
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
