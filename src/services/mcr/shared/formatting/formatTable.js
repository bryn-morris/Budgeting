import { getLastRowofTable_ } from "../getLastRowofTable";
import { setTableFont } from "../../../../spreadsheet/shared/setTableFont";
import { setTableBorders } from "./setTableBorders";

export function formatTable(sheet, cfg) {
  const startRow = Number(cfg.table_start_row);
  const lastRow = getLastRowofTable_(sheet, cfg);
  const numRows = Math.max(0, lastRow - startRow + 1);

  const startCol = Number(cfg.category_id_column);
  const endCol = Number(cfg.table_end_column);
  const numCols = endCol - startCol + 1;
  const headerRow = startRow-1;

  if (!Number.isInteger(startRow) || startRow < 1) return;
  if (!Number.isInteger(startCol) || startCol < 1) return;
  if (!Number.isInteger(endCol) || endCol < startCol) return;
  if (numCols <= 0) return;
 
  setTableBorders(sheet, startRow, startCol, numRows, numCols, headerRow, lastRow);

  setTableFont(sheet, startRow, startCol, numRows, numCols);

  if (numRows <=0) return;

  if (cfg.tab_name === CONFIG_OBJECT.category_mapping.pool) {

    for (let i =0; i< numRows; i++) {
      const row = startRow + i;

      // Merge cells C-D and F-G
      sheet.getRange(row, 3, 1, 2).breakApart().merge();
      sheet.getRange(row, 6, 1, 2).breakApart().merge();
    }

  }
}