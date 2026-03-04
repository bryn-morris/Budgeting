

export function setTableFont (sheet, startRow, startCol, numRows, numCols) {
    
    const tableRange = sheet.getRange(
        startRow,
        startCol,
        numRows,
        numCols,
    );

    tableRange
        .setFontFamily("Inconsolata")
        .setFontSize(10)
        .setFontWeight("normal")
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle");

    const secondTableCol = sheet.getRange(
        startRow,
        startCol + 1,
        numRows,
        1
    )

    secondTableCol
        .setFontSize(11)
    
}