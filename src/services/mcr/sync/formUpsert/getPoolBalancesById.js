
import { getLastRowofTable_ } from "../../shared/getLastRowofTable";

export function getPoolBalancesById_(ss) {

  const poolsSheetName = CONFIG_OBJECT.sheets[
    CONFIG_OBJECT.category_mapping.pool
  ].tab_name;

  const cfg = CONFIG_OBJECT.sheets[poolsSheetName];
  const sheet = ss.getSheetByName(poolsSheetName);

  if (!sheet) {
    throw new Error(`Pools sheet not found: ${poolsSheetName}`);
  }

  const startRow = cfg.table_start_row;
  const lastRow = getLastRowofTable_(sheet, cfg);

  if (!lastRow || lastRow < startRow) {
    return new Map();
  }

  const numRows = lastRow - startRow + 1;

  const ids = sheet
    .getRange(startRow, cfg.category_id_column, numRows, 1)
    .getDisplayValues()
    .map(r => String(r[0]).trim());

  const balances = sheet
    .getRange(startRow, cfg.current_balance, numRows, 1)
    .getDisplayValues()
    .map(r => String(r[0]).trim());

  const map = new Map();

  for (let i = 0; i < numRows; i++) {
    const id = ids[i];
    const bal = balances[i];

    if (!id) continue;

    map.set(id, bal);
  }

  return map;
}