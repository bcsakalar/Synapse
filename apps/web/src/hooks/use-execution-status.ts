"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface StepStatusEvent {
  runId: string;
  nodeId: string;
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "SKIPPED";
  timestamp: number;
}

export function useExecutionStatus(runId: string | null) {
  const [stepStatuses, setStepStatuses] = useState<Map<string, StepStatusEvent>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatuses = useCallback(async () => {
    if (!runId) return;
    try {
      const res = await fetch(`/api/workflows/runs/${runId}/status`);
      const data = await res.json();
      if (data.success && data.data) {
        const map = new Map<string, StepStatusEvent>();
        for (const step of data.data) {
          map.set(step.nodeId, {
            runId,
            nodeId: step.nodeId,
            status: step.status,
            timestamp: Date.now(),
          });
        }
        setStepStatuses(map);
      }
    } catch {
      // ignore
    }
  }, [runId]);

  useEffect(() => {
    if (!runId) return;
    setIsConnected(true);
    fetchStatuses();

    // Poll every 2 seconds for status updates
    intervalRef.current = setInterval(fetchStatuses, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsConnected(false);
    };
  }, [runId, fetchStatuses]);

  const getNodeStatus = useCallback(
    (nodeId: string) => stepStatuses.get(nodeId)?.status ?? "PENDING",
    [stepStatuses]
  );

  return { stepStatuses, isConnected, getNodeStatus };
}
