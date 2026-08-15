export const CONFIG_OBJECT = {
  form :{
    form_id: "1WT_DkTsPOZ6Ys_DCVxdJtIcyTnLhCwYIs7Xl3cyZHk0",
    dropdown_ids: {
      expense_category: "752519196",
      expense_pools_category: "1067936705",
      income_category: "658637086",
      pool_funding_category: "1777025688",
    },
    question_titles: {
      timestamp: "Timestamp",
      submission_type: "What are you logging?",
      expense: {
        vendor_title: "Vendor/Title",
        date: "Expense Date",
        amount: "Expense Amount",
        category: "Expense Category",
        paid_via: "Paid Via",
        pool_category: "Pool Expense Category",
        pool_withdrawal_amount: "Pool Withdrawal Amount",
        paid_back_via_venmo: "Paid back via Venmo?",
        venmo_reimbursements: [
          "Venmo reimbursement 1",
          "Venmo reimbursement 2",
          "Venmo reimbursement 3",
          "Venmo reimbursement 4"
        ]
      },
      income: {
        date: "Income Date",
        amount: "Income Amount",
        category: "Income Category"
      },
      pool_funding: {
        date:"Pool Funding Date",¬
        category: "Pool Funding Category",
        contribution_amount: "Pool Contribution Amount"
      },
      savings_transfer: {
        date: "Savings Transfer Date",
        amount: "Savings Transfer Amount",
        direction: "Savings Direction"
      }
    },
    answer_values: {
      submission_types: {
        expense: "Expense",
        income: "Income",
        pool_funding: "Pool Funding",
        savings_transfer: "Savings Transfer"
      },
      paid_via: {
        bank:"Bank",
        venmo:"Venmo"
      },
      savings_directions: {
        deposit: "Deposit to Savings",
        withdrawal: "Withdrawal from Savings"
      }
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
      table_end_column: 6,
    },
    'Recurring Payments (Fixed Monthly Expenses)':{
      tab_name: 'Recurring Payments (Fixed Monthly Expenses)',
      watch_column: 6,
      table_start_row: 7,
      date_set_column: 10,
      category_id_column: 3,
      category_name_column: 4,
      table_end_column: 11,

      autopay_column: 8,
    },
    'Variable Payments (Variable Monthly Expenses)':{
      tab_name: 'Variable Payments (Variable Monthly Expenses)',
      watch_column: 4,
      table_start_row: 7,
      date_set_column: 5,
      category_id_column: 2,
      category_name_column: 3,
      table_end_column: 6,
    },
    'Master Category Registry':{
      tab_name: 'Master Category Registry',
      watch_column: null,
      table_start_row:5,
      date_set_column: null,
      category_id_column: 3,
      category_name_column: 5,
      table_end_column: 9,

      mcr_line_start: 3,
      mcr_line_end: 7,
      mcr_status_column:9,
      type_column: 4,
      form_order_column: 6,
      active_status_column: 7,
    },
    'Pools (Budgeted Non-Monthly Expenses)':{
      tab_name: 'Pools (Budgeted Non-Monthly Expenses)',
      watch_column: null,
      table_start_row: 4,
      date_set_column: null,       
      category_id_column: 2,
      category_name_column: 3,
      table_end_column:7,

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