export function getLastRowofTable_(sheet, targetConfig) {

const startRow = targetConfig.table_start_row;
const idCol = targetConfig.category_id_column;

const capLast = sheet.getLastRow(); // just an upper bound
  if (capLast < startRow) return { lastRow: startRow - 1, numRows: 0 };

  const idVals = sheet.getRange(startRow, idCol, capLast - startRow + 1, 1).getValues();

  let count = 0;
  for (let i = 0; i < idVals.length; i++) {
    const id = String(idVals[i][0] ?? "").trim();
    if (!id) break;      // first blank ID ends the table
    count++;
  }

  const lastRow = startRow + count - 1

  return lastRow;
}