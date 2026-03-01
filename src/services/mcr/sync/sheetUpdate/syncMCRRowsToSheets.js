import { parseMCRLine_ } from "./parseMCRLine.js";
import { CONFIG_OBJECT } from "../../../../config/config.js";
import { upsertMCRLine_ } from "./upsertMCRLine.js";
import { upsertPoolTotalRow_ } from "./upsertPoolTotalRow.js"

export function syncMCRRowsToSheets_(ss, mcrSheet, mcrCfgObj, readyRows) {
  
  const processedRows = [];
  
  try {

    for (const row of readyRows) {
      const entry = parseMCRLine_(mcrSheet, row, mcrCfgObj);

      // Skip inactive rows
      if (!entry) continue;

      const targetSheetName = CONFIG_OBJECT.category_mapping[entry.type];

      const targetCfg = CONFIG_OBJECT.sheets[targetSheetName];

      if (!targetSheetName) {
        throw new Error(`MCR row ${row}: unknown type "${entry.type}"`);
      }

      if (entry.type === "pool") {
        upsertPoolTotalRow_(ss, targetSheetName, targetCfg, entry);
      } else{
        upsertMCRLine_(ss, targetSheetName, targetCfg, entry);
      }

      processedRows.push(row);
    }

    // Mark only successfully processed rows as DONE
    processedRows.forEach(r => {
      mcrSheet.getRange(r, mcrCfgObj.mcr_status_column).setValue("DONE");
    });
  
    return processedRows;

  } catch (err) {
    throw err;
  }
}