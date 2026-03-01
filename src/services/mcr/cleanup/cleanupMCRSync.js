import { CONFIG_OBJECT } from "../../../config/config.js";
import { cleanupTargetTable_ } from "./cleanupTargetTable.js";
import { getValidIDSetByMCRType_ } from "./getValidIDSetByMCRType";

export function cleanupMCRSync(ss) {

  const mcrConfig = CONFIG_OBJECT.sheets['Master Category Registry'];
  const mcrSheet = ss.getSheetByName(mcrConfig.tab_name);

  // Build valid ID sets by type
  const {
    recurring: validRecurringIds,
    variable: validVariableIds,
    pool: validPoolIds,
    income: validIncomeIds,
  } = getValidIDSetByMCRType_(mcrSheet, mcrConfig);

  let deletedEntries = 0;

  // --- Income ---
  const incomeConfig = CONFIG_OBJECT.sheets[CONFIG_OBJECT.category_mapping.variable];
  const incomeSheet = ss.getSheetByName(incomeConfig.tab_name);
  deletedEntries += cleanupTargetTable_(incomeSheet, validIncomeIds);

  // --- Recurring ---
  
  const recurringConfig = CONFIG_OBJECT.sheets[CONFIG_OBJECT.category_mapping.recurring];
  const recurringSheet = ss.getSheetByName(recurringConfig.tab_name);
  deletedEntries += cleanupTargetTable_(recurringSheet, validRecurringIds);
  

  // --- Variable ---
  
  const variableConfig = CONFIG_OBJECT.sheets[CONFIG_OBJECT.category_mapping.variable];
  const variableSheet = ss.getSheetByName(variableConfig.tab_name);
  deletedEntries += cleanupTargetTable_(variableSheet, validVariableIds);
  

  // --- Pools ---
  
  const poolConfig = CONFIG_OBJECT.sheets[CONFIG_OBJECT.category_mapping.pool];
  const poolSheet = ss.getSheetByName(poolConfig.tab_name);
  deletedEntries += cleanupTargetTable_(poolSheet, validPoolIds);

  SpreadsheetApp.getActive().toast(
    `Cleanup complete: ${deletedEntries} rows removed.`,
    "MCR Sync",
    5 // seconds
  );
};
