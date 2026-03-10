import { getLastRowofTable_ } from "../../shared/getLastRowofTable";

export function buildMCRFormOrderMapping (ui, mcrSheet, mcrCfgObj) {

    const idToFormOrderMapping = {};

    try {
  
        const startRow = mcrCfgObj.table_start_row;
        const idCol = mcrCfgObj.category_id_column;
        const formOrderCol = mcrCfgObj.form_order_column;
        const activeCol = mcrCfgObj.active_status_column;

        const lastRow = getLastRowofTable_(mcrSheet, mcrCfgObj);

        if (lastRow < startRow) return {};

        const numRows = lastRow - startRow +1;

        const mcrIDs = mcrSheet.getRange(startRow, idCol, numRows, 1).getValues();
        const formOrders = mcrSheet.getRange(startRow, formOrderCol, numRows, 1).getValues();
        const activeStatuses = mcrSheet.getRange(startRow, activeCol, numRows, 1).getValues();

        // loop through table and grab all relevant values that are ACTIVE

        for (let i = 0; i < numRows; i++) {
            const id = String(mcrIDs[i][0] ?? "").trim();
            const formOrder = Number(formOrders[i][0] ?? "");
            const activeStatus = String(activeStatuses[i][0] ?? "").trim().toUpperCase();

            if (!id) continue;
            if (!formOrder) continue;
            if (activeStatus !== "Y") continue;

            idToFormOrderMapping[id] = formOrder;
        };

    } catch (err) {
        ui.alert(`Failed to build Form Order Mapping.\n${err.message}`);
        throw err;
    }

    return idToFormOrderMapping
};