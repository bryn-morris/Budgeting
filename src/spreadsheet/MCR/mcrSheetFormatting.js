import { tableDataValidation } from "../shared/tableDataValidation";
import { CONFIG_OBJECT } from "../../config/config";
import { getLastRowofTable_ } from "../../services/mcr/shared/getLastRowofTable";
import { generateUUIDs } from "./generateUUIDs";
import { getLastRowafterFirstBlank } from "./getLastRowafterFirstBlank";

export function mcrSheetFormatting (e) {

    if (!e || e.changeType !== "INSERT_ROW") return;

    const ss = SpreadsheetApp.getActive();
    const affectedSheetName = e.source.getActiveSheet().getName()

    const mcrSheet = ss.getSheetByName('Master Category Registry');
    const mcrCfgObj = CONFIG_OBJECT.sheets['Master Category Registry'];

    if (affectedSheetName !== mcrCfgObj.tab_name) return;

    const startRow = mcrCfgObj.table_start_row;
    const idCol = mcrCfgObj.category_id_column;
    const typeCol = mcrCfgObj.type_column;
    const actCol = mcrCfgObj.active_status_column;

    const lastRow = getLastRowafterFirstBlank(mcrSheet, startRow, idCol);
    const numRows = Math.max(0, lastRow - startRow + 1);

    //Type Column Data Validation

    const typeRule = SpreadsheetApp.newDataValidation()
        .requireValueInList(Object.keys(CONFIG_OBJECT.category_mapping))
        .setAllowInvalid(false)
        .build();

    tableDataValidation(
        mcrSheet,
        startRow,
        typeCol,
        numRows,
        typeRule,
    );
    
    // Active Column Data Validation

    const activeRule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Y","N",])
        .setAllowInvalid(false)
        .build();

    tableDataValidation(
        mcrSheet,
        startRow,
        actCol,
        numRows,
        activeRule,
    );

    // Automatically Assign UUID's to new entries in MCR
    
    generateUUIDs(
        mcrSheet, 
        startRow,
        idCol, 
        numRows
    );

};