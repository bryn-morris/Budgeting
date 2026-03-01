import { isMCRRowComplete_ } from "../shared/isMCRRowComplete";
import { getLastRowofTable_ } from "../shared/getLastRowofTable";

export function getValidIDSetByMCRType_(mcrSheet, mcrConfig) {

  const startRow = mcrConfig.mcr_table_start_row;
  const lastRow = getLastRowofTable_(mcrSheet, mcrConfig);

  const validIDObj = {
    recurring: new Set(),
    variable: new Set(),
    pool: new Set(),
    income: new Set(),
  };

  if (lastRow < startRow) {
    return validIDObj;
  }

  for (let r = startRow; r <= lastRow; r++) {

    const id = String(
      mcrSheet.getRange(r, mcrConfig.id_column).getValue()
    ).trim();

    if (!id) continue;

    const active = String(
      mcrSheet.getRange(r, mcrConfig.active_status_column).getValue()
    ).trim().toUpperCase();

    if (active !== "Y") continue;

    // Ensure row is complete
    if (!isMCRRowComplete_(mcrSheet, r, mcrConfig)) continue;

    const rowType = String(
      mcrSheet.getRange(r, mcrConfig.type_column).getValue()
    ).trim().toLowerCase();

    if (!validIDObj[rowType]) continue;

    validIDObj[rowType].add(id);
  }

  return validIDObj;
}
