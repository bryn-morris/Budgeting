

export function setTableBorders (sheet, startRow, startCol, numRows, numCols, headerRow, lastRow) {
    // if table is empty
  if (numRows === 0) {
    // bold bottom border on header row across the table columns
    const headerRange = sheet.getRange(headerRow, startCol, 1, numCols);
    headerRange.setBorder(
      null, null, true, null,   // top, left, bottom, right
      null, null,               // vertical, horizontal
      null,
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );

    return;
  }

  const tableRange = sheet.getRange(startRow, startCol, numRows, numCols);

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
};