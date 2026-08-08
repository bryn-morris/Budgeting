import { getActiveMcrByType_ } from "./getActiveMCRbyType";


export function syncPoolDropdownData_(
    form,
    formDataByType,
    poolIdBalMap,
) {

    const poolsCatArray = poolsCategoryConstructor(formDataByType, poolIdBalMap);

    setDropdownChoicesByItemId(form, ids.expense_pools_category, poolsCatArray);
    setDropdownChoicesByItemId(form, ids.pool_funding_category, poolsCatArray);
    
};