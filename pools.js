function findPoolsTotalEndRow_(sheet, cfg) {
  const startRow = cfg.table_start_row; // 4
  const idCol = cfg.category_id_column;
  const nameCol = cfg.category_name_column;

  const lastRow = sheet.getLastRow();
  if (lastRow < startRow) return startRow - 1;

  const numRows = lastRow - startRow + 1;

  // Read both columns in one call (faster than row-by-row)
  const ids = sheet.getRange(startRow, idCol, numRows, 1).getValues().map(r => String(r[0]).trim());
  const names = sheet.getRange(startRow, nameCol, numRows, 1).getValues().map(r => String(r[0]).trim());

  let lastDataOffset = -1;
  let blankStreak = 0;
  const BLANK_STREAK_TO_STOP = 3;

  for (let i = 0; i < numRows; i++) {
    const hasData = ids[i] !== "" || names[i] !== "";

    if (hasData) {
      lastDataOffset = i;
      blankStreak = 0;
    } else {
      blankStreak++;
      if (blankStreak >= BLANK_STREAK_TO_STOP && lastDataOffset !== -1) {
        // We’ve hit the “gap” after the table; stop scanning.
        break;
      }
    }
  }

  if (lastDataOffset === -1) return startRow - 1; // no data at all
  return startRow + lastDataOffset;
}

function upsertPoolTotalRow_(ss, poolsSheetName, poolsCfg, entry) {
  const sheet = ss.getSheetByName(poolsSheetName);
  if (!sheet) throw new Error(`Pools sheet not found: ${poolsSheetName}`);

  const idCol = poolsCfg.category_id_column;
  const nameCol = poolsCfg.category_name_column;
  const startRow = poolsCfg.table_start_row; // 4

  const endRow = findPoolsTotalEndRow_(sheet, poolsCfg);

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
