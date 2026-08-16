import { CONFIG_OBJECT } from "../config/config";

export function routeSub_(
    flattenedValues
) {

    const formConfig = CONFIG_OBJECT.form;

    // Parse submission type
    const formSubType = formConfig.question_titles.submission_type;
    const qType = flattenedValues[formSubType];

    // case for routing logic

};