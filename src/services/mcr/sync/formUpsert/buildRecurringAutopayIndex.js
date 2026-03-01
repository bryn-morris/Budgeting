import { getLastRowofTable_ } from "../../shared/getLastRowofTable";

export function buildRecurringAutopayIndex_(ss, recurringCfg) {
  const sheet = ss.getSheetByName(recurringCfg.tab_name);
  if (!sheet) throw new Error(`Missing sheet: "${recurringCfg.tab_name}"`);

  const startRow = recurringCfg.table_start_row;
  const lastRow = getLastRowofTable_(sheet,recurringCfg);
  if (lastRow < startRow) return new Map();

  const numRows = lastRow - startRow + 1;

  const idVals = sheet.getRange(startRow, recurringCfg.category_id_column, numRows, 1).getValues();
  const apVals = sheet.getRange(startRow, recurringCfg.autopay_column, numRows, 1).getValues();

  const idx = new Map(); // mcrId (string) -> boolean (true if autopay Y)

  for (let i = 0; i < numRows; i++) {
    const id = String(idVals[i][0] ?? "").trim();
    if (!id) continue;

    const autopay = String(apVals[i][0] ?? "").trim().toUpperCase() === "Y";
    idx.set(id, autopay);
  }

  return idx;
}