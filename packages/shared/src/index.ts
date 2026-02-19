// ─── Synapse Shared Package ───
// Central exports for the monorepo

// Database
export { prisma, prisma as db } from "./db";

// Encryption
export { encrypt, decrypt, encryptCredentials, decryptCredentials } from "./crypto";
export type { EncryptedData } from "./crypto";

// Schemas (Zod validation)
export * from "./schemas";

// Types
export * from "./types";

// Constants & Node Registry
export { NodeType, NodeCategory, NODE_REGISTRY } from "./constants";
export type { NodeTypeMetadata, ConfigField } from "./constants";

// Variable Interpolation
export { extractVariables, interpolateVariables, interpolateConfig } from "./variables";

// Redis
export { getRedisConnection, createRedisConnection } from "./redis";
