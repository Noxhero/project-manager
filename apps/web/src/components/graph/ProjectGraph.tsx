import { useCallback, useMemo, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "../ui/Button";
import { useAppSelector } from "../../app/hooks";
import type { Project } from "../../types";

const nodeTypes = {};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "default",
    position: { x: 250, y: 50 },
    data: { label: "Projet A" },
    style: { background: "#1e293b", border: "1px solid #475569", color: "#f1f5f9" }
  }
];

const initialEdges: Edge[] = [];

export function ProjectGraph({ projectId }: { projectId?: string }) {
  const { items: projects } = useAppSelector((s) => s.projects);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isAddingConnection, setIsAddingConnection] = useState(false);

  // Generate nodes from projects
  const graphNodes = useMemo(() => {
    if (!projectId) {
      // Show all projects
      return projects.map((project, index) => ({
        id: project._id,
        type: "default",
        position: { 
          x: 200 + (index % 3) * 250, 
          y: 100 + Math.floor(index / 3) * 150 
        },
        data: { 
          label: (
            <div className="text-center">
              <div className="font-medium text-slate-50">{project.name}</div>
              <div className="text-xs text-slate-400 mt-1">
                {project.tags.slice(0, 2).join(", ")}
              </div>
            </div>
          )
        },
        style: { 
          background: "#1e293b", 
          border: "1px solid #475569", 
          color: "#f1f5f9",
          width: 180,
          height: 80
        }
      }));
    } else {
      // Show single project and its connections
      const project = projects.find(p => p._id === projectId);
      if (!project) return [];
      
      return [{
        id: project._id,
        type: "default",
        position: { x: 250, y: 150 },
        data: { 
          label: (
            <div className="text-center">
              <div className="font-medium text-slate-50">{project.name}</div>
              <div className="text-xs text-slate-400 mt-1">
                {project.description.slice(0, 30)}...
              </div>
            </div>
          )
        },
        style: { 
          background: "#3b82f6", 
          border: "1px solid #60a5fa", 
          color: "#f1f5f9",
          width: 200,
          height: 80
        }
      }];
    }
  }, [projects, projectId]);

  // Update nodes when projects change
  useEffect(() => {
    if (graphNodes.length > 0) {
      setNodes(graphNodes);
    }
  }, [graphNodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (isAddingConnection) {
        const newEdge = {
          ...params,
          id: `${params.source}-${params.target}`,
          type: "smoothstep",
          style: { stroke: "#60a5fa", strokeWidth: 2 },
          label: "dépend de"
        };
        setEdges((eds) => addEdge(newEdge, eds));
        setIsAddingConnection(false);
      }
    },
    [isAddingConnection, setEdges]
  );

  const addConnectionMode = () => {
    setIsAddingConnection(!isAddingConnection);
  };

  const clearConnections = () => {
    setEdges([]);
  };

  return (
    <div className="w-full h-full bg-slate-950 rounded-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        style={{ background: "#0f172a" }}
      >
        <Background color="#1e293b" gap={20} />
        <Controls 
          style={{ background: "#1e293b", border: "1px solid #475569" }}
          showInteractive={false}
        />
        <MiniMap 
          style={{ background: "#1e293b", border: "1px solid #475569" }}
          nodeColor={(node) => node.style?.background as string || "#1e293b"}
          maskColor="rgba(0, 0, 0, 0.8)"
        />
        
        <Panel position="top-right" className="bg-slate-800/90 backdrop-blur rounded-lg p-2 border border-white/10">
          <div className="flex gap-2">
            <Button 
              onClick={addConnectionMode}
              variant={isAddingConnection ? "primary" : "ghost"}
              className="text-xs px-2 py-1"
            >
              {isAddingConnection ? "Mode connexion" : "+ Connexion"}
            </Button>
            <Button 
              onClick={clearConnections}
              variant="ghost"
              className="text-xs px-2 py-1"
            >
              Effacer
            </Button>
          </div>
        </Panel>

        <Panel position="top-left" className="bg-slate-800/90 backdrop-blur rounded-lg p-3 border border-white/10">
          <div className="text-xs text-slate-300">
            <div className="font-medium mb-1">Graphes sémantiques</div>
            <div className="text-slate-400">
              {isAddingConnection ? "Cliquez sur deux projets pour les connecter" : "Visualisez les relations entre projets"}
            </div>
          </div>
        </Panel>

        {nodes.length === 0 && (
          <Panel position="top-left" className="text-center mt-20">
            <div className="text-slate-400">
              <div className="text-2xl mb-2">🔗</div>
              <div className="text-sm">Aucun projet à afficher</div>
              <div className="text-xs mt-1">Créez des projets pour voir leurs connexions</div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
