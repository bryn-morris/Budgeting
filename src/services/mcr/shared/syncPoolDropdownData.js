import { getActiveMcrByType_ } from "../sync/formUpsert/getActiveMCRbyType";


export function syncPoolDropdownData_(
    form,
    formDataByType,
    poolIdBalMap,
) {

    const ids = CONFIG_OBJECT.form.dropdown_ids
    const poolsCatArray = poolsCategoryConstructor(formDataByType, poolIdBalMap);

    setDropdownChoicesByItemId(form, ids.expense_pools_category, poolsCatArray);
    setDropdownChoicesByItemId(form, ids.pool_funding_category, poolsCatArray);
    
};