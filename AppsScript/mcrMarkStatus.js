function mcrMarkStatus(e) {
  
  const edited_sheet = e.range.getSheet();
  const config_key = CONFIG_OBJECT.sheets[edited_sheet.getName()];
  const row = e.range.getRow();
  
  // Check changes are on right sheet
  if(!config_key || config_key.mcr_line_start == null || config_key.mcr_line_end == null) return;

  // Make sure range is after table start
  if (row < config_key.mcr_table_start_row) return;

  // Make sure updates are in the acceptable range
  const colStart = e.range.getColumn();
  const colEnd = colStart + e.range.getNumColumns() -1;
  const acceptableRange = !(colEnd < config_key.mcr_line_start || colStart > config_key.mcr_line_end);
  if(!acceptableRange) return;

  const statusCell = edited_sheet.getRange(row,config_key.mcr_status_column);

  // Clear Row if status is empty
  
  if(isMcrRowEmpty_(edited_sheet,row,config_key)) {
    statusCell.setValue("");
    return
  }

  // If row is listed as inactive, mark inactive
  const activeRaw = String(sheet.getRange(row, cfg.active_status_column).getValue()).trim().toUpperCase();
  if (activeRaw !== "Y") {
    statusCell.setValue("INACTIVE");
    return;
  }

  //Status change if row is not complete
  const completionStatus = isMCRRowComplete_(edited_sheet,row,config_key);
  if (!completionStatus) {
    statusCell.setValue("INCOMPLETE");
    return;
  }

  // Status change if row is complete 
  statusCell.setValue("READY TO SYNC");

}

/////////////////////////////////////
//////////////////// HELPERS
/////////////////////////////////////

function isMCRRowComplete_(sheet, row, config_key){
  const width = config_key.mcr_line_end - config_key.mcr_line_start+1;
  const values = sheet.getRange(row,config_key.mcr_line_start, 1, width).getValues()[0];
  return values.every(v=>String(v).trim() !== "");
}

function isMcrRowEmpty_(sheet, row, cfg) {
  const width = cfg.mcr_line_end - cfg.mcr_line_start + 1;
  const values = sheet.getRange(row, cfg.mcr_line_start, 1, width).getValues()[0];
  return values.every(v => String(v).trim() === "");
}