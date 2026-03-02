import { getLastRowofTable_ } from "../getLastRowofTable";

export function formatTable(sheet, cfg) {
  const startRow = Number(cfg.table_start_row);
  const lastRow = getLastRowofTable_(sheet, cfg);
  const numRows = Math.max(0, lastRow - startRow + 1);

  const startCol = Number(cfg.category_id_column);
  const endCol = Number(cfg.table_end_column);
  const numCols = endCol - startCol + 1;

  // ✅ Only bail if columns are invalid
  if (!Number.isInteger(startRow) || startRow < 1) return;
  if (!Number.isInteger(startCol) || startCol < 1) return;
  if (!Number.isInteger(endCol) || endCol < startCol) return;
  if (numCols <= 0) return;

  // If table empty: still format one row so the top border exists visually
  const rowsToFormat = numRows === 0 ? 1 : numRows;

  const tableRange = sheet.getRange(startRow, startCol, rowsToFormat, numCols);

  tableRange.setBorder(false, false, false, false, false, false);

  tableRange.setBorder(
    true, true, true, true,
    true, true,
    null,
    SpreadsheetApp.BorderStyle.SOLID
  );

  const firstRowRange = sheet.getRange(startRow, startCol, 1, numCols);
  firstRowRange.setBorder(
    true, null, null, null,
    null, null,
    null,
    SpreadsheetApp.BorderStyle.SOLID_MEDIUM
  );

  if (numRows > 0) {
    const lastDataRowRange = sheet.getRange(lastRow, startCol, 1, numCols);
    lastDataRowRange.setBorder(
      null, null, true, null,
      null, null,
      null,
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
  }

  tableRange.setBorder(
    null, true, null, true,
    null, null,
    null,
    SpreadsheetApp.BorderStyle.SOLID_MEDIUM
  );
}