import { CONFIG_OBJECT } from "../../../config/config.js";
import { formatTable } from "../shared/formatting/formatTable.js";
import { getLastRowofTable_ } from "../shared/getLastRowofTable.js";

export function cleanupTargetTable_(targetSheet, targetValidIDSet) {

  const targetSheetName = targetSheet.getName();
  const targetConfig = CONFIG_OBJECT.sheets[targetSheetName];
  const startRow = targetConfig.table_start_row;

  const lastRow = getLastRowofTable_(targetSheet,targetConfig);

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
  if (targetValidIDSet.length != 0) {
      formatTable(targetSheet,targetConfig);
  }


  return deletedRowsCount;
}
