export function isMCRRowComplete_(sheet, row, config_key){
  const width = config_key.mcr_line_end - config_key.mcr_line_start+1;
  const values = sheet.getRange(row,config_key.mcr_line_start, 1, width).getValues()[0];
  return values.every(v=>String(v).trim() !== "");
}