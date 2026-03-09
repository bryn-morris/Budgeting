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

  // If ID exists, update name
  const idx = ids.indexOf(entry.id);
  if (idx !== -1) {
    const existingRow = startRow + idx;
    sheet.getRange(existingRow, nameCol).setValue(entry.name);
    return;
  }

  let insertOffset = -1
  // If  no ID, and no name and table is not empty, insert into first empty table
  for (let i = 0; i < numRows; i++) {
    if (!ids[i] && !names[i] && endRow !== startRow) {
      insertOffset = i;
      break;
    }
  }

  let targetRow;
  let appendedRow = false;

  if (insertOffset !== -1) {
    //reusing empty row in table
    targetRow = startRow + insertOffset;
  } else {
    // append into the spacer row (or StartRow if empty)
    targetRow = (endRow >= startRow) ? endRow + 1 : startRow;
    appendedRow = true;
  }

  sheet.getRange(targetRow, idCol).setValue(entry.id);
  sheet.getRange(targetRow, nameCol).setValue(entry.name);

  // Merge cells C-D and F-G
  sheet.getRange(targetRow, 3, 1, 2).breakApart().merge();
  sheet.getRange(targetRow, 6, 1, 2).breakApart().merge();

  // if spacer row was used, insert another spacer row
  if (appendedRow) {
    sheet.insertRowAfter(targetRow);
  }

  // recalculate end row now that lines have been added
  const reCalcEndRow = getLastRowofTable_(sheet,poolsCfg);
  // freeze the row below the last row of the table

  const frozenRow = (reCalcEndRow >= startRow) ? (reCalcEndRow +1) : startRow;

  sheet.setFrozenRows(frozenRow)

}
