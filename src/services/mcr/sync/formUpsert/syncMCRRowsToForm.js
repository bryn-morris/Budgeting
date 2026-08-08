import { getActiveMcrByType_ } from "./getActiveMCRbyType";
import { getPoolBalancesById_ } from "./getPoolBalancesById";
import { expenseCategoryConstructor } from "./constructor/expenseCategoryConstructor";
import { incomeCategoryConstructor } from "./constructor/incomeCategoryCosntructor";
import { poolsCategoryConstructor } from "./constructor/poolCategoryConstructor";
import { setDropdownChoicesByItemId } from "./setDropdownChoicesByItemId";
import { syncPoolDropdownData_ } from "../../shared/syncPoolDropdownData";

export function syncMRCRowsToForm(
        ss,
        ui, 
        mcrSheet, 
        mcrCfgObj
    ) {
    
    const formCfg = CONFIG_OBJECT.form;
    const ids = formCfg.dropdown_ids;

    const form = FormApp.openById(formCfg.form_id);

    try {

        // grabMCRData
        const formDataByType = getActiveMcrByType_(ss, mcrSheet, mcrCfgObj);
        
        //getPoolAmountsById
        const poolIdBalMap = getPoolBalancesById_(ss);

        //construct dropdown category Arrays
        const expenseCatArray = expenseCategoryConstructor(formDataByType);
        const incomeCatArray = incomeCategoryConstructor(formDataByType);
      
        //Push Category Changes
        setDropdownChoicesByItemId(form, ids.expense_category, expenseCatArray);
        setDropdownChoicesByItemId(form, ids.income_category, incomeCatArray);
        syncPoolDropdownData_(form,formDataByType,poolIdBalMap);
        
    } catch (err) {
    ui.alert(`Form Category Sync failed.\n${err.message}`);
    throw err;
  };
};