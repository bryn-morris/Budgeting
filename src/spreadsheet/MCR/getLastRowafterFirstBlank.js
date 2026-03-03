

export function getLastRowafterFirstBlank (sheet, startRow, idCol) {

    const capLast = sheet.getLastRow(); // just an upper bound
    if (capLast < startRow) return startRow - 1

    const idVals = sheet.getRange(startRow, idCol, capLast - startRow + 1, 1).getValues();

    let count = 0;
    let skippedFirstBlank = false;


    for (let i = 0; i < idVals.length; i++) {
        const id = String(idVals[i][0] ?? "").trim();
        
        if (!id) {
            if(!skippedFirstBlank) {
                skippedFirstBlank = true;
                count++;
                continue;
            } break;
        }    
          
        count++;
    }

    const lastRow = startRow + count - 1

    return lastRow;
}