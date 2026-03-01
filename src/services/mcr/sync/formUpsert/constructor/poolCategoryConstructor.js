export function poolsCategoryConstructor(mcrByType, poolBalancesById) {
  // mcrByType.pool: [{id, name, order}]
  const arr = [...(mcrByType.pool || [])];

  arr.sort((a, b) => {
    const d = (a.order ?? 9999) - (b.order ?? 9999);
    if (d !== 0) return d;
  });

  return arr.map(x => {
    const bal = poolBalancesById?.get(x.id);
    return bal ? `🔵 ${x.name} — ${bal}` : `🔵 ${x.name}`;
  });
}