import { getLastRowofTable_ } from "../../shared/getLastRowofTable";

export function upsertPoolTotalRow_(ss, poolsSheetName, poolsCfg, entry) {
  const sheet = ss.getSheetByName(poolsSheetName);
  if (!sheet) throw new Error(`Pools sheet not found: ${poolsSheetName}`);

  const idCol = poolsCfg.category_id_column;
  const nameCol = poolsCfg.category_name_column;
  const startRow = poolsCfg.table_start_row; // 4
  const lastRow = getLastRowofTable_(sheet,poolsCfg);
  const numRows = Math.max(0, lastRow - startRow + 1);
  const endRow = getLastRowofTable_(sheet, poolsCfg);

  // Read existing IDs/names only within the top Pools Total table
  let ids = [];
  let names = [];
  if (numRows > 0) {
    ids = sheet.getRange(startRow, idCol, numRows, 1).getValues().map(r => String(r[0]).trim());
    names = sheet.getRange(startRow, nameCol, numRows, 1).getValues().map(r => String(r[0]).trim());
  }

  // 1) If ID exists, update name
  const idx = ids.indexOf(entry.id);
  if (idx !== -1) {
    const existingRow = startRow + idx;
    sheet.getRange(existingRow, nameCol).setValue(entry.name);
    return;
  }

  // 2) Otherwise insert into the first empty slot in the table, or extend it
  let insertOffset = -1;
  for (let i = 0; i < numRows; i++) {
    if (!ids[i] && !names[i]) {
      insertOffset = i;
      break;
    }
  }

  let targetRow;

  if (insertOffset !== -1) {
    targetRow = startRow + insertOffset;
  } else {
    // Extend the Pools Total table by inserting one row after its current end
    targetRow = (endRow >= startRow) ? endRow + 1 : startRow;
    if (endRow >= startRow) sheet.insertRowAfter(endRow);
  }

  sheet.getRange(targetRow, idCol).setValue(entry.id);
  sheet.getRange(targetRow, nameCol).setValue(entry.name);

  // Merge cells C-D and F-G
  sheet.getRange(targetRow, 3, 1, 2).breakApart().merge();
  sheet.getRange(targetRow, 6, 1, 2).breakApart().merge();

  // recalculate end row now that lines have been added
  const reCalcEndRow = getLastRowofTable_(sheet,poolsCfg);
  // freeze the row below the last row of the table

  const frozenRow = (reCalcEndRow >= startRow) ? (reCalcEndRow +1) : startRow;

  sheet.setFrozenRows(frozenRow)

}
