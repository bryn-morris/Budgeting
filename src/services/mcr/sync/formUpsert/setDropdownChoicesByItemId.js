export function setDropdownChoicesByItemId(form, itemId, choices) {
  const idNum = Number(itemId);
  if (!idNum) throw new Error(`Invalid form itemId: ${itemId}`);

  const item = form.getItemById(idNum);
  if (!item) throw new Error(`Form item not found: itemId=${itemId}`);

  if (choices.length === 0) return;

  item.asListItem().setChoiceValues(choices);
}