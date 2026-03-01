export function incomeCategoryConstructor(mcrByType) {
  const arr = [...(mcrByType.income || [])];

  arr.sort((a, b) => {
    const d = (a.order ?? 9999) - (b.order ?? 9999);
    if (d !== 0) return d;
  });

  return arr.map(x => `🟢 ${x.name}`);
}