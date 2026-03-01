import { getLastRowofTable_ } from "../../shared/getLastRowofTable";

export function parseMCRTable(ui, mcrSheet, mcrCfgObj) {
    
    const readyRows = [];

    try {
        const startRowPos = mcrCfgObj.table_start_row;
        const status_column_id = mcrCfgObj.mcr_status_column;
        const lastRowPos = getLastRowofTable_(mcrSheet,mcrCfgObj);

        //If table has no entries, abort
        if(lastRowPos < startRowPos) return;

        console.log(`last Row POS ${lastRowPos}`)
        // Grab Status Values from Status Column
        const statusCells = mcrSheet.getRange(startRowPos, status_column_id, lastRowPos-startRowPos+1, 1);
        const statusValues = statusCells.getValues();

        statusValues.forEach(
            (r,i)=>{
            // grab text but remove whitespace
            // compare against ready to sync string
            // add row value to readyRows array
            if(String(r[0]).trim() === "READY TO SYNC"){
                readyRows.push(startRowPos + i)
            };
            }
        );
    } catch (err) {
        ui.alert(`Could not parse MCR Table.\n${err.message}`);
        throw err;
    }
    
    if(!readyRows.length) return readyRows;
    
    return []; 
};