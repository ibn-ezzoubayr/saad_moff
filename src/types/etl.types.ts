export type NodeCategory = 'extraction' | 'filtrage' | 'transformation' | 'merging' | 'exportation';

export interface NodeType {
  id: string;
  label: string;
  category: NodeCategory;
  icon: string;
  color: string;
}

export interface CanvasNode {
  id: string;
  typeId: string;
  label: string;
  category: NodeCategory;
  icon: string;
  color: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  connectedTo?: string[];
}

export interface Connection {
  from: string;
  to: string;
}

export interface PipelineState {
  nodes: CanvasNode[];
  connections: Connection[];
  selectedNodeId: string | null;
}
