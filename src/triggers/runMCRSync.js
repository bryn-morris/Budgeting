import { syncMCR } from "../services/mcr/sync/syncMCR.js";

export function runMCRSync(e) {
    syncMCR();
};