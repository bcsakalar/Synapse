// ─── Variable Interpolation Engine ───
// Resolves {{step.nodeId.output.field}} references in node configs

import { VariableReference } from "./types";

const VARIABLE_PATTERN = /\{\{step\.([a-zA-Z0-9_-]+)\.output\.([a-zA-Z0-9_.\[\]]+)\}\}/g;

/**
 * Extract all variable references from a string
 */
export function extractVariables(template: string): VariableReference[] {
  const variables: VariableReference[] = [];
  let match: RegExpExecArray | null;

  const pattern = new RegExp(VARIABLE_PATTERN.source, "g");
  while ((match = pattern.exec(template)) !== null) {
    variables.push({
      fullMatch: match[0],
      nodeId: match[1],
      path: `output.${match[2]}`,
    });
  }

  return variables;
}

/**
 * Resolve a dot-notation path against an object
 * e.g., getNestedValue({ output: { summary: "hello" } }, "output.summary") => "hello"
 */
function getNestedValue(obj: unknown, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) return undefined;

    // Handle array index: field[0]
    const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      current = (current as Record<string, unknown>)[arrayMatch[1]];
      if (Array.isArray(current)) {
        current = current[parseInt(arrayMatch[2], 10)];
      } else {
        return undefined;
      }
    } else {
      current = (current as Record<string, unknown>)[key];
    }
  }

  return current;
}

/**
 * Interpolate all {{step.X.output.Y}} variables in a string
 * using the outputs from previous steps
 */
export function interpolateVariables(
  template: string,
  stepOutputs: Record<string, unknown>
): string {
  return template.replace(
    new RegExp(VARIABLE_PATTERN.source, "g"),
    (fullMatch, nodeId: string, fieldPath: string) => {
      const nodeOutput = stepOutputs[nodeId];
      if (nodeOutput === undefined) return fullMatch; // Leave unresolved

      const value = getNestedValue(nodeOutput, `output.${fieldPath}`) 
        ?? getNestedValue(nodeOutput, fieldPath);

      if (value === undefined || value === null) return fullMatch;
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    }
  );
}

/**
 * Deep interpolate variables in an entire config object
 */
export function interpolateConfig(
  config: Record<string, unknown>,
  stepOutputs: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === "string") {
      result[key] = interpolateVariables(value, stepOutputs);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[key] = interpolateConfig(value as Record<string, unknown>, stepOutputs);
    } else {
      result[key] = value;
    }
  }

  return result;
}
