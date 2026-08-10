import { getActiveMcrByType_ } from "../services/mcr/sync/formUpsert/getActiveMCRbyType";
import { syncPoolDropdownData_ } from "../services/mcr/shared/syncPoolDropdownData";

export function onFormSubmit(e){

    console.log(e.namedValues)

    // const ss = e.source;

    // const mcrCfgObj = CONFIG_OBJECT.sheets["Master Category Registry"];
    // const mcrSheet = ss.getSheetByName(mcrCfgObj.tab_name);

    // SpreadsheetApp.flush();

    // const form = FormApp.openById(CONFIG_OBJECT.form.form_id);
    // const formDataByType = getActiveMcrByType_(ss, mcrSheet, mcrCfgObj);

    // Parse Form Data
    // Update Sheet(s)
    // Read Sheet to update form
    
    // Sync New Pool Balances to form dropdowns

        //  //getPoolAmountsById
        // const poolIdBalMap = getPoolBalancesById_(ss);
        // syncPoolDropdownData_(form, formDataByType, )
};
