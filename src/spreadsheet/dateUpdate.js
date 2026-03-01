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
  const col = config_key.date_set_column;
  const numRows = e.range.getNumRows()

  edited_sheet
    .getRange(row,col,numRows,1)
    .setValue(Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd"
    ));
};