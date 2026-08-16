import { CONFIG_OBJECT } from "../../config/config";
import { processExpense_ } from "./processExpense";

export function routeSub_(
    flattenedValues
) {

    const formConfig = CONFIG_OBJECT.form;

    // Parse submission type
    const formSubType = formConfig.question_titles.submission_type;
    const qType = flattenedValues[formSubType];

    // case for routing logic
    const answerTypes = formConfig.answer_values.submission_type;

    switch (qType) {

        case answerTypes.expense:
            return processExpense_(flattenedValues);
        case answerTypes.income:
            // create income processor
            ;
        case answerTypes.pool_funding:
            // create pool funding processor
            ;
        case answerTypes.savings_transfer:
            // create savings transfer processor
            ;
        
        default:
            throw new Error(`Unknown submission type: "${qType}"`)
    };

};