export function generateUUIDs (
    sheet, 
    startRow,
    idCol, 
    numRows
) {
    
    const idRange = sheet.getRange(startRow, idCol, numRows, 1);
    const values = idRange.getValues();

    for (let i = 0; i < values.length; i++) {
        
        const currentidVal = values[i][0];

        // Skip rows with ID's assigned
        
        if(currentidVal) continue;

        sheet
            .getRange(startRow + i, idCol)
            .setValue(Utilities.getUuid());
    }
};