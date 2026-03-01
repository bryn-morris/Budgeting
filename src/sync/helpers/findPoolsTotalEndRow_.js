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