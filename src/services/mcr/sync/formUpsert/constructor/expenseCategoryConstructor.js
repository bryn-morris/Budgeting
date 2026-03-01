export function expenseCategoryConstructor(mcrByType) {
  const expenseArray = [
    ...mcrByType.recurring.map(x => ({ ...x, type: "recurring" })),
    ...mcrByType.variable.map(x => ({ ...x, type: "variable" })),
  ];

  expenseArray.sort((a, b) => {
    const d = (a.order ?? 9999) - (b.order ?? 9999);
    if (d !== 0) return d;
  });

  return expenseArray.map(x => {
    const icon = x.type === "recurring" ? "🔁" : "🟡";
    return `${icon} ${x.name}`;
  });
}