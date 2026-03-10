import { getReadyRows } from "./getReadyRows";
import { buildMCRFormOrderMapping } from "./buildMCRFormOrderMapping";

export function parseMCRTable(ui, mcrSheet, mcrCfgObj) {
    
    // grab the Ready to Sync Rows
    const readyRows = getReadyRows(ui, mcrSheet,mcrCfgObj);

    // create a form order mapping for whole mcr table
    const idToFormOrderMapping = buildMCRFormOrderMapping(ui, mcrSheet, mcrCfgObj);

    return {
        readyRows: readyRows,
        idToFormOrderMapping: idToFormOrderMapping,
    }
    
};