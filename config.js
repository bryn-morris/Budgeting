const CONFIG_OBJECT = {
  sheets: {
    'Recurring Payments (Fixed Monthly Expenses)':{
      tab_name: 'Recurring Payments (Fixed Monthly Expenses)',
      watch_column: 6,
      table_start_row: 7,
      date_set_column: 10,
      category_id_column: 3,
      category_name_column: 4
    },
    'Variable Payments (Variable Monthly Expenses)':{
      tab_name: 'Variable Payments (Variable Monthly Expenses)',
      watch_column: 4,
      table_start_row: 7,
      date_set_column: 5,
      category_id_column: 2,
      category_name_column: 3,
    },
    'Master Category Registry':{
      tab_name: 'Master Category Registry',
      mcr_line_start: 3,
      mcr_line_end: 7,
      mcr_table_start_row:5,
      mcr_status_column:9,
      id_column: 3,
      type_column: 4,
      name_column: 5,
      form_order_column: 6,
      active_status_column: 7,
    },
    'Pools (Budgeted Non-Monthly Expenses)':{
      tab_name: 'Pools (Budgeted Non-Monthly Expenses)',
      table_start_row: 4,         
      category_id_column: 2,
      category_name_column: 3,
    },
  },
  category_mapping: {
    pool: 'Pools (Budgeted Non-Monthly Expenses)',
    recurring: 'Recurring Payments (Fixed Monthly Expenses)',
    variable: 'Variable Payments (Variable Monthly Expenses)',
  },
};