export const CONFIG_OBJECT = {
  form :{
    form_id: "1WT_DkTsPOZ6Ys_DCVxdJtIcyTnLhCwYIs7Xl3cyZHk0",
    dropdown_ids: {
      expense_category: "752519196",
      expense_pools_category: "1067936705",
      income_category: "658637086",
      pool_funding_category: "1777025688",
    }
  },
  sheets: {
    'Income Review' : {
      tab_name: 'Income Review',
      watch_column: 4,
      table_start_row: 7,
      date_set_column: 5,
      category_id_column: 2,
      category_name_column: 3,
    },
    'Recurring Payments (Fixed Monthly Expenses)':{
      tab_name: 'Recurring Payments (Fixed Monthly Expenses)',
      watch_column: 6,
      table_start_row: 7,
      date_set_column: 10,
      category_id_column: 3,
      category_name_column: 4,

      autopay_column: 8,
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
      watch_column: "",
      table_start_row:5,
      date_set_column: "",
      category_id_column: 3,
      category_name_column: 5,

      mcr_line_start: 3,
      mcr_line_end: 7,
      mcr_status_column:9,
      type_column: 4,
      form_order_column: 6,
      active_status_column: 7,
    },
    'Pools (Budgeted Non-Monthly Expenses)':{
      tab_name: 'Pools (Budgeted Non-Monthly Expenses)',
      table_start_row: 4,         
      category_id_column: 2,
      category_name_column: 3,
      current_balance: 6,
    },
  },
  category_mapping: {
    pool: 'Pools (Budgeted Non-Monthly Expenses)',
    recurring: 'Recurring Payments (Fixed Monthly Expenses)',
    variable: 'Variable Payments (Variable Monthly Expenses)',
    income: 'Income Review',
  },
};