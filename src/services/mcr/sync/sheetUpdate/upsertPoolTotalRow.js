import { getLastRowofTable_ } from "../../shared/getLastRowofTable";

export function upsertPoolTotalRow_(ss, poolsSheetName, poolsCfg, entry) {
  const sheet = ss.getSheetByName(poolsSheetName);
  if (!sheet) throw new Error(`Pools sheet not found: ${poolsSheetName}`);

  const idCol = poolsCfg.category_id_column;
  const nameCol = poolsCfg.category_name_column;
  const startRow = poolsCfg.table_start_row; // 4

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

  if (insertOffset !== -1) {
    const row = startRow + insertOffset;
    sheet.getRange(row, idCol).setValue(entry.id);
    sheet.getRange(row, nameCol).setValue(entry.name);
  } else {
    // Extend the Pools Total table by inserting one row after its current end
    const row = (endRow >= startRow) ? endRow + 1 : startRow;
    if (endRow >= startRow) sheet.insertRowAfter(endRow);

    sheet.getRange(row, idCol).setValue(entry.id);
    sheet.getRange(row, nameCol).setValue(entry.name);
  }
}
