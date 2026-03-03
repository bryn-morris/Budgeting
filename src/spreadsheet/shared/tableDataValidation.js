

export function tableDataValidation(sheet, startRow, column, numsRows, rule) {
    const targetRange = sheet.getRange(startRow, column, numsRows, 1);
    targetRange.setDataValidation(rule);
}