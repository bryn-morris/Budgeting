import { getLastRowofTable_ } from "../../shared/getLastRowofTable";


export function reorderTargetTable (ss, targetSheetName, targetCfg, idToFormOrderMapping) {
   
    const sheet = ss.getSheetByName(targetSheetName);
    if (!sheet) throw new Error(`Target sheet not found: ${targetSheetName}`);

    const startRow = targetCfg.table_start_row;
    const startCol = targetCfg.category_id_column;
    const endCol = targetCfg.table_end_column;
    const idCol = targetCfg.category_id_column;

    const numCols = endCol - startCol + 1;
    if (numCols <= 0) return;

    const lastRow = getLastRowofTable_(sheet, targetCfg);
    const numRows = Math.max(0,lastRow - startRow + 1);
    if (numRows <= 1) return;

    const tableRange = sheet.getRange(startRow, startCol, numRows, numCols);

    // Remove merging from tables like pools
    tableRange.breakApart();

    const tableValues = tableRange.getValues();
    const idIndex = idCol - startCol;

    tableValues.sort((a, b) => {
        const idA = String(a[idIndex] ?? "").trim();
        const idB = String(b[idIndex] ?? "").trim();

        //infinity moves values to bottom if they aren't in form order mapping
        const orderA = Number(idToFormOrderMapping[idA] ?? Infinity);
        const orderB = Number(idToFormOrderMapping[idB] ?? Infinity);

        return orderA - orderB;
    });

    tableRange.setValues(tableValues);
};