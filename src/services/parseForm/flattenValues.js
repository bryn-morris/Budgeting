

export function flattenValues (formData) {

    const flattenedValues = {};

    for (
        const [question,answers]
        of Object.entries(formData)
    ) {
        flattenValues[question] = answers[0] ?? "";
    };

    return flattenedValues
};