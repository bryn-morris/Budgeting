import { getLastRowofTable_ } from "../../shared/getLastRowofTable";

export function upsertMCRLine_(ss, targetSheetName, targetCfg, upsertData) {
  
  const sheet = ss.getSheetByName(targetSheetName);
  
  // Need different logic to handle pools

  const target_id_col = targetCfg.category_id_column;
  const target_name_col = targetCfg.category_name_column;
  const target_start_row = targetCfg.table_start_row;
  const target_last_row = getLastRowofTable_(sheet,targetCfg);
  const numRows = Math.max(0,target_last_row-target_start_row + 1);

  let existingRow = null;

  if (numRows > 0) {
    const ids = sheet.getRange(target_start_row, target_id_col, numRows, 1).getValues()
      .map(r => String(r[0]).trim());

    const idx = ids.indexOf(upsertData.id);
    if (idx !== -1) existingRow = target_start_row + idx;
  }

  if (existingRow) {
    sheet.getRange(existingRow, target_name_col).setValue(upsertData.name);
  } else {
    const newRow = getLastRowofTable_(sheet, targetCfg) + 1;
    sheet.getRange(newRow, target_id_col).setValue(upsertData.id);
    sheet.getRange(newRow, target_name_col).setValue(upsertData.name);
  }
};