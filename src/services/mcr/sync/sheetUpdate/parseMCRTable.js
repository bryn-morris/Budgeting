

export function parseMCRTable(mcrSheet,mcrCfgObj) {
    try {
        const startRowPos = mcrCfgObj.mcr_table_start_row;
        const lastRowPos = mcrSheet.getLastRow();

        //If table has no entries, abort
        if(lastRowPos < startRowPos) return;

        // Grab Status Values from Status Column
        const statusCells = mcrSheet.getRange(startRowPos, mcrCfgObj.mcr_status_column, lastRowPos-startRowPos+1, 1);
        const statusValues = statusCells.getValues();

        //Grab the row numbers for any rows marked as "READY TO SYNC"
        //**ROOM TO ITERATE ON USING A SIMPLE ARRAY FOR DATA STORAGE */
        const readyRows = [];
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
    // Abort if there are no categories in "READY TO SYNC"
    //**REFINE TO USE TRY BLOCKS AND THROW ERRORS */
    if(!readyRows.length) return; 
};