import {buildRecurringAutopayIndex_} from "./buildRecurringAutopayIndex"
import { getLastRowofTable_ } from "../../shared/getLastRowofTable";

export function getActiveMcrByType_(ss, mcrSheet, cfg) {

  const startRow = cfg.table_start_row;
  const lastRow = getLastRowofTable_(mcrSheet,cfg);
  const out = { recurring: [], variable: [], pool: [], income: [] };

  if (lastRow < startRow) return out;

  // 🔹 Build recurring autopay index once
  const recurringCfg = CONFIG_OBJECT.sheets["Recurring Payments (Fixed Monthly Expenses)"];
  const autopayById = recurringCfg
    ? buildRecurringAutopayIndex_(ss, recurringCfg)
    : new Map();

  const width = cfg.mcr_line_end - cfg.mcr_line_start + 1;
  const rows = mcrSheet
    .getRange(startRow, cfg.mcr_line_start, lastRow - startRow + 1, width)
    .getValues();

  const idxId = cfg.category_id_column - cfg.mcr_line_start;
  const idxType = cfg.type_column - cfg.mcr_line_start;
  const idxName = cfg.category_name_column - cfg.mcr_line_start;
  const idxOrder = cfg.form_order_column - cfg.mcr_line_start;
  const idxActive = cfg.active_status_column - cfg.mcr_line_start;

  rows.forEach(r => {

    const active = String(r[idxActive] ?? "").trim().toUpperCase();
    if (active !== "Y") return;

    const id = String(r[idxId] ?? "").trim();
    const type = String(r[idxType] ?? "").trim().toLowerCase();
    const name = String(r[idxName] ?? "").trim();
    const orderRaw = r[idxOrder];

    if (!id || !name) return;
    if (!out[type]) return;

    // 🔑 Business rule: exclude recurring autopay categories
    if (type === "recurring" && autopayById.get(id) === true) {
      return;
    }

    const order = Number(orderRaw);

    out[type].push({
      id,
      name,
      order: Number.isFinite(order) ? order : 9999
    });
  });

  Object.keys(out).forEach(k => {
    out[k].sort((a, b) =>
      (a.order - b.order) || a.name.localeCompare(b.name)
    );
  });

  return out;
}