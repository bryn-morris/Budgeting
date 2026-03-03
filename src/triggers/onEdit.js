import { date_update } from "../spreadsheet/shared/dateUpdate";
import { mcrMarkStatus } from "../services/mcr/status/mcrMarkStatus";

export function onEdit(e) {
  date_update(e)
  mcrMarkStatus(e)
};
