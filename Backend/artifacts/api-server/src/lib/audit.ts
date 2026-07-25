import { createHash } from "node:crypto";

export interface AuditEntry {
  id: number;
  previous_hash: string;
  timestamp: string;
  user_id: string;
  action: string;
  resource: string;
  metadata: Record<string, unknown>;
  hash: string;
}

const auditLog: AuditEntry[] = [];

const computeHash = (entry: Omit<AuditEntry, "hash">): string => {
  const hash = createHash("sha256");
  hash.update(JSON.stringify(entry));
  return hash.digest("hex");
};

export const appendAuditEntry = (entry: Omit<AuditEntry, "id" | "previous_hash" | "hash">): AuditEntry => {
  const previousHash = auditLog.length > 0 ? auditLog[auditLog.length - 1].hash : "";
  const nextEntry: AuditEntry = {
    id: auditLog.length + 1,
    previous_hash: previousHash,
    timestamp: new Date().toISOString(),
    ...entry,
    hash: "",
  };
  nextEntry.hash = computeHash({
    id: nextEntry.id,
    previous_hash: nextEntry.previous_hash,
    timestamp: nextEntry.timestamp,
    user_id: nextEntry.user_id,
    action: nextEntry.action,
    resource: nextEntry.resource,
    metadata: nextEntry.metadata,
  });
  auditLog.push(nextEntry);
  return nextEntry;
};

export const getAuditLogs = (): AuditEntry[] => [...auditLog];

export const verifyAuditLogIntegrity = (): boolean => {
  for (let i = 0; i < auditLog.length; i += 1) {
    const entry = auditLog[i];
    const reconstructed = computeHash({
      id: entry.id,
      previous_hash: entry.previous_hash,
      timestamp: entry.timestamp,
      user_id: entry.user_id,
      action: entry.action,
      resource: entry.resource,
      metadata: entry.metadata,
    });
    if (reconstructed !== entry.hash) {
      return false;
    }
    if (i > 0 && entry.previous_hash !== auditLog[i - 1].hash) {
      return false;
    }
  }
  return true;
};
