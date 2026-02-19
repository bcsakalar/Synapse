"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const WorkflowCanvas = dynamic(() => import("@/components/flow/workflow-canvas"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface WorkflowData {
  id: string;
  name: string;
  nodes: unknown[];
  edges: unknown[];
  isActive: boolean;
  webhookUrl?: string;
}

export default function WorkflowEditorPage() {
  const params = useParams();
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/workflows/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setWorkflow(d.data);
        } else {
          setError(d.error);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load workflow");
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-destructive">{error ?? "Workflow not found"}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-0px)]">
      <WorkflowCanvas
        workflowId={workflow.id}
        initialNodes={workflow.nodes as never[]}
        initialEdges={workflow.edges as never[]}
        initialName={workflow.name}
        webhookUrl={workflow.webhookUrl}
        isActive={workflow.isActive}
      />
    </div>
  );
}
