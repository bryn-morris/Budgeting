export function parseMCRLine_(mcrSheet, row, cfg) {
  
  const id = String(mcrSheet.getRange(row, cfg.id_column).getValue()).trim();
  const type = String(mcrSheet.getRange(row, cfg.type_column).getValue()).trim().toLowerCase();
  const name = String(mcrSheet.getRange(row, cfg.name_column).getValue()).trim();
  const activeStatus = String(mcrSheet.getRange(row, cfg.active_status_column).getValue()).trim().toLowerCase();
  const formOrder = Number(mcrSheet.getRange(row, cfg.form_order_column).getValue());

  if (activeStatus !== "Y") return null;
  
  if (!id) throw new Error(`MCR row ${row}: missing ID`);
  if (!type) throw new Error(`MCR row ${row}: missing Type`);
  if (!name) throw new Error(`MCR row ${row}: missing Name`);

  return {row, id, type, name, activeStatus, formOrder}
};