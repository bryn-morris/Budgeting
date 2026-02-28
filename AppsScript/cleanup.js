function cleanupMCRSync(ss) {

  const mcrConfig = CONFIG_OBJECT.sheets['Master Category Registry'];
  const mcrSheet = ss.getSheetByName(mcrConfig.tab_name);

  // Build valid ID sets by type
  const {
    recurring: validRecurringIds,
    variable: validVariableIds,
    pool: validPoolIds
  } = getValidIDSetByMCRType_(mcrSheet, mcrConfig);

  let deletedEntries = 0;

  // --- Recurring ---
  
  const recurringConfig = CONFIG_OBJECT.sheets[CONFIG_OBJECT.category_mapping.recurring];
  const recurringSheet = ss.getSheetByName(recurringConfig.tab_name);
  deletedEntries += cleanupTargetTable_(recurringSheet, validRecurringIds);
  

  // --- Variable ---
  
  const variableConfig = CONFIG_OBJECT.sheets[CONFIG_OBJECT.category_mapping.variable];
  const variableSheet = ss.getSheetByName(variableConfig.tab_name);
  deletedEntries += cleanupTargetTable_(variableSheet, validVariableIds);
  

  // --- Pools ---
  
  const poolConfig = CONFIG_OBJECT.sheets[CONFIG_OBJECT.category_mapping.pool];
  const poolSheet = ss.getSheetByName(poolConfig.tab_name);
  deletedEntries += cleanupTargetTable_(poolSheet, validPoolIds);

  SpreadsheetApp.getActive().toast(
    `Cleanup complete: ${deletedEntries} rows removed.`,
    "MCR Sync",
    5 // seconds
  );
};
////////////////////////////////////////////////////
// HELPERS
////////////////////////////////////////////////////

function getValidIDSetByMCRType_(mcrSheet, mcrConfig) {

  const startRow = mcrConfig.mcr_table_start_row;
  const lastRow = mcrSheet.getLastRow();

  const validIDObj = {
    recurring: new Set(),
    variable: new Set(),
    pool: new Set(),
  };

  if (lastRow < startRow) {
    return validIDObj;
  }

  for (let r = startRow; r <= lastRow; r++) {

    const id = String(
      mcrSheet.getRange(r, mcrConfig.id_column).getValue()
    ).trim();

    if (!id) continue;

    const active = String(
      mcrSheet.getRange(r, mcrConfig.active_status_column).getValue()
    ).trim().toUpperCase();

    if (active !== "Y") continue;

    // Ensure row is complete
    if (!isMCRRowComplete_(mcrSheet, r, mcrConfig)) continue;

    const rowType = String(
      mcrSheet.getRange(r, mcrConfig.type_column).getValue()
    ).trim().toLowerCase();

    if (!validIDObj[rowType]) continue;

    validIDObj[rowType].add(id);
  }

  return validIDObj;
}

function cleanupTargetTable_(targetSheet, targetValidIDSet) {

  const targetSheetName = targetSheet.getName();
  const targetConfig = CONFIG_OBJECT.sheets[targetSheetName];
  const startRow = targetConfig.table_start_row;

  let lastRow;

  if (targetSheetName === "Pools (Budgeted Non-Monthly Expenses)") {
    lastRow = findPoolsTotalEndRow_(targetSheet, targetConfig);
  } else {
    lastRow = targetSheet.getLastRow();
  }

  const idCol = targetConfig.category_id_column;
  const numRows = Math.max(0, lastRow - startRow + 1);

  if (numRows === 0) return 0;

  const rawTargetSheetIds = targetSheet
    .getRange(startRow, idCol, numRows, 1)
    .getValues();

  const normalizedTargetIDs = rawTargetSheetIds.map(r =>
    String(r[0]).trim()
  );

  let deletedRowsCount = 0;

  // Loop bottom-up to avoid shifting row indexes
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
