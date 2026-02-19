"use client";

import dynamic from "next/dynamic";

const WorkflowCanvas = dynamic(() => import("@/components/flow/workflow-canvas"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function NewWorkflowPage() {
  return (
    <div className="h-[calc(100vh-0px)]">
      <WorkflowCanvas />
    </div>
  );
}
