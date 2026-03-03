// function onEdit(e) {
//   const sheet = e.source.getActiveSheet();
//   if (sheet.getName() == 'Recurring Payments (Fixed Monthly Expenses)') { 
//     if (e.range.getColumn() == 4 && e.range.getRow() > 3) {
//       sheet.getRange(e.range.getRow(), 9).setValue(
//         Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")
//       );
//     }
//   }
// }

export function date_update(e) {

  const edited_sheet = e.range.getSheet();
  const config_key = CONFIG_OBJECT.sheets[edited_sheet.getName()];

  // Check that changes are happenning on correct Sheet
  if(!config_key || config_key.table_start_row == null || config_key.watch_column == null) return;

  const row = e.range.getRow();
  const date_col = config_key.date_set_column;
  const id_col = config_key.category_id_column;
  const watch_col = config_key.watch_column;
  const numRows = e.range.getNumRows()
  
  // check for id, if no id in row
  const idCell = edited_sheet.getRange(row, id_col, numRows, 1)
  const watchCell = edited_sheet.getRange(row, watch_col, numRows, 1)
  // check value of cell to see if truthy

  if(idCell.getValue() && watchCell.getValue()) {
    edited_sheet
      .getRange(row,date_col,numRows,1)
      .setValue(Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        "yyyy-MM-dd"
      ));
  } else {
    edited_sheet
      .getRange(row, date_col, numRows,1)
      .setValue('');
  }
    return
};