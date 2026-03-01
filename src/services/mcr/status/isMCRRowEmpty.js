export function isMcrRowEmpty_(sheet, row, cfg) {
  const width = cfg.mcr_line_end - cfg.mcr_line_start + 1;
  const values = sheet.getRange(row, cfg.mcr_line_start, 1, width).getValues()[0];
  return values.every(v => String(v).trim() === "");
}