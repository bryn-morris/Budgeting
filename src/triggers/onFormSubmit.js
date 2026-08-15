import { getActiveMcrByType_ } from "../services/mcr/sync/formUpsert/getActiveMCRbyType";
import { syncPoolDropdownData_ } from "../services/mcr/shared/syncPoolDropdownData";
import { parseFormSubmission } from "../services/parseForm/parseFormSubmission";

export function onFormSubmit(e){

    // validate submission

    try {

        const formData = e.namedValues;

        if (!e) throw new Error;

        // Parse and normalize submission
        parseFormSubmission(formData);

        // route submission
        // process

    } catch (err) {
        console.log(err);
        throw err;
    }

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
