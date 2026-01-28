import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fetchProjects } from "../app/slices/projectsSlice";
import { AIProjectAssistant } from "../utils/aiProjectSuggestions";
import type { Project } from "../types";

interface GraphNode {
  id: string;
  type: 'project' | 'concept';
  label: string;
  description?: string;
  tags?: string[];
  x: number;
  y: number;
  color: string;
  size: number;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  type: 'DEPENDS_ON' | 'SIMILAR_TO' | 'SHARES_RESOURCES_WITH' | 'PRECEDES';
  label: string;
  confidence: number;
  reason: string;
}

interface GraphLayout {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function GraphPage() {
  const dispatch = useAppDispatch();
  const { items: projects, loading: projectsLoading } = useAppSelector((s) => s.projects);
  
  const [graphData, setGraphData] = useState<GraphLayout>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'selected' | 'ai-suggestions'>('all');
  const [layoutType, setLayoutType] = useState<'force' | 'hierarchical' | 'circular'>('force');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Generate graph data from projects
  useEffect(() => {
    if (projects.length === 0) return;

    const nodes: GraphNode[] = projects.map((project, index) => ({
      id: project._id,
      type: 'project',
      label: project.name,
      description: project.description,
      tags: project.tags,
      x: 400 + Math.cos((index / projects.length) * Math.PI * 2) * 200,
      y: 300 + Math.sin((index / projects.length) * Math.PI * 2) * 200,
      color: '#3b82f6',
      size: 40 + project.tags.length * 5
    }));

    // Add concept nodes
    const conceptNodes: GraphNode[] = [
      {
        id: 'planning',
        type: 'concept',
        label: 'Planning',
        description: 'Phase de planification',
        x: 200,
        y: 150,
        color: '#10b981',
        size: 30
      },
      {
        id: 'development',
        type: 'concept',
        label: 'Development',
        description: 'Phase de développement',
        x: 600,
        y: 150,
        color: '#f59e0b',
        size: 30
      },
      {
        id: 'testing',
        type: 'concept',
        label: 'Testing',
        description: 'Phase de test',
        x: 400,
        y: 450,
        color: '#ef4444',
        size: 30
      }
    ];

    const allNodes = [...nodes, ...conceptNodes];

    // Generate AI suggestions
    const suggestions = AIProjectAssistant.generateGraphSuggestions(projects);
    const edges: GraphEdge[] = suggestions.map((suggestion, index) => ({
      id: `edge-${index}`,
      from: suggestion.fromProject,
      to: suggestion.toProject,
      type: suggestion.relationship,
      label: suggestion.relationship.replace('_', ' ').toLowerCase(),
      confidence: suggestion.confidence,
      reason: suggestion.reason
    }));

    setGraphData({ nodes: allNodes, edges });
  }, [projects]);

  // Filter nodes based on search and tags
  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter(node => {
      const matchesSearch = !searchTerm || 
        node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = filterTags.length === 0 ||
        (node.tags && node.tags.some(tag => filterTags.includes(tag)));
      
      return matchesSearch && matchesTags;
    });
  }, [graphData.nodes, searchTerm, filterTags]);

  // Filter edges based on visible nodes
  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return graphData.edges.filter(edge => 
      nodeIds.has(edge.from) && nodeIds.has(edge.to)
    );
  }, [graphData.edges, filteredNodes]);

  // Generate AI suggestions
  const generateAISuggestions = useCallback(async () => {
    setIsGeneratingAI(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const suggestions = AIProjectAssistant.generateGraphSuggestions(projects);
      setAiSuggestions(suggestions);
      setShowAISuggestions(true);
      toast.success(`${suggestions.length} suggestions IA générées !`);
    } catch (error) {
      toast.error("Erreur lors de la génération des suggestions");
    } finally {
      setIsGeneratingAI(false);
    }
  }, [projects]);

  // Apply AI suggestions to graph
  const applyAISuggestions = () => {
    const newEdges = aiSuggestions.map((suggestion, index) => ({
      id: `ai-edge-${index}`,
      from: suggestion.fromProject,
      to: suggestion.toProject,
      type: suggestion.relationship,
      label: suggestion.relationship.replace('_', ' ').toLowerCase(),
      confidence: suggestion.confidence,
      reason: suggestion.reason
    }));

    setGraphData(prev => ({
      ...prev,
      edges: [...prev.edges, ...newEdges]
    }));
    
    setShowAISuggestions(false);
    toast.success("Suggestions IA appliquées au graphe !");
  };

  // Calculate graph statistics
  const graphStats = useMemo(() => {
    const projectNodes = filteredNodes.filter(n => n.type === 'project');
    const conceptNodes = filteredNodes.filter(n => n.type === 'concept');
    const highConfidenceEdges = filteredEdges.filter(e => e.confidence > 0.7);
    
    return {
      totalNodes: filteredNodes.length,
      projectNodes: projectNodes.length,
      conceptNodes: conceptNodes.length,
      totalEdges: filteredEdges.length,
      highConfidenceEdges: highConfidenceEdges.length,
      avgConfidence: filteredEdges.length > 0 
        ? (filteredEdges.reduce((sum, e) => sum + e.confidence, 0) / filteredEdges.length).toFixed(2)
        : 0
    };
  }, [filteredNodes, filteredEdges]);

  // Get all unique tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [projects]);

  const toggleTagFilter = (tag: string) => {
    setFilterTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Graphe des Projets</h1>
        <p className="mt-1 text-sm text-slate-400">
          Visualisation et analyse des connexions sémantiques entre projets
        </p>
      </header>

      {/* Controls */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="text-sm font-medium text-slate-50">Recherche</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un projet..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          {/* View Mode */}
          <div>
            <label className="text-sm font-medium text-slate-50">Mode de vue</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
            >
              <option value="all">Tous les projets</option>
              <option value="selected">Sélectionnés</option>
              <option value="ai-suggestions">Suggestions IA</option>
            </select>
          </div>

          {/* Layout */}
          <div>
            <label className="text-sm font-medium text-slate-50">Disposition</label>
            <select
              value={layoutType}
              onChange={(e) => setLayoutType(e.target.value as any)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
            >
              <option value="force">Force</option>
              <option value="hierarchical">Hiérarchique</option>
              <option value="circular">Circulaire</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-2">
            <Button
              onClick={generateAISuggestions}
              disabled={isGeneratingAI || projects.length === 0}
              className="flex-1"
            >
              {isGeneratingAI ? <LoadingSpinner size="sm" /> : '🤖'} IA Suggestions
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowStats(!showStats)}
            >
              📊 Stats
            </Button>
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-50">Filtres par tags</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    filterTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Statistics */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h3 className="text-lg font-medium text-slate-50 mb-4">Statistiques du graphe</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{graphStats.totalNodes}</div>
                <div className="text-xs text-slate-400">Nœuds totaux</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{graphStats.projectNodes}</div>
                <div className="text-xs text-slate-400">Projets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{graphStats.conceptNodes}</div>
                <div className="text-xs text-slate-400">Concepts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{graphStats.totalEdges}</div>
                <div className="text-xs text-slate-400">Connexions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{graphStats.highConfidenceEdges}</div>
                <div className="text-xs text-slate-400">Haute confiance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{graphStats.avgConfidence}</div>
                <div className="text-xs text-slate-400">Confiance moyenne</div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Graph Visualization */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-50">Visualisation du graphe</h3>
          <div className="flex gap-2">
            <Badge variant="primary">
              {filteredNodes.length} nœuds
            </Badge>
            <Badge variant="default">
              {filteredEdges.length} connexions
            </Badge>
          </div>
        </div>

        <div className="relative h-[600px] bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
          {projectsLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : filteredNodes.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🔗</div>
                <div>Aucun projet à afficher</div>
                <div className="text-sm mt-1">Créez des projets pour voir les connexions</div>
              </div>
            </div>
          ) : (
            <svg className="w-full h-full">
              {/* Render edges */}
              {filteredEdges.map(edge => {
                const fromNode = filteredNodes.find(n => n.id === edge.from);
                const toNode = filteredNodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                return (
                  <g key={edge.id}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={edge.confidence > 0.7 ? '#60a5fa' : '#475569'}
                      strokeWidth={edge.confidence * 3}
                      strokeDasharray={edge.type === 'DEPENDS_ON' ? '5,5' : '0'}
                      opacity={0.6}
                    />
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Render nodes */}
              {filteredNodes.map(node => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={node.color}
                    stroke={selectedNode === node.id ? '#60a5fa' : '#1e293b'}
                    strokeWidth={selectedNode === node.id ? 3 : 2}
                    className="cursor-pointer transition-all hover:opacity-80"
                    onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    fill="white"
                    fontSize="12"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                  >
                    {node.label}
                  </text>
                  {node.tags && node.tags.length > 0 && (
                    <text
                      x={node.x}
                      y={node.y + node.size + 15}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {node.tags.slice(0, 2).join(', ')}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-slate-400">Projets</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-400">Concepts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0 border-t-2 border-blue-500"></div>
            <span className="text-slate-400">Haute confiance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0 border-t-2 border-t-dashed border-slate-500"></div>
            <span className="text-slate-400">Dépendance</span>
          </div>
        </div>
      </Card>

      {/* AI Suggestions Modal */}
      {showAISuggestions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAISuggestions(false)}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-50">Suggestions IA</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {aiSuggestions.length} connexions suggérées
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowAISuggestions(false)}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-3 mb-6">
              {aiSuggestions.map((suggestion, index) => {
                const fromProject = projects.find(p => p._id === suggestion.fromProject);
                const toProject = projects.find(p => p._id === suggestion.toProject);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-white/10 rounded-xl p-4 bg-white/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="primary" size="sm">
                            {suggestion.relationship.replace('_', ' ')}
                          </Badge>
                          <Badge variant="default" size="sm">
                            {(suggestion.confidence * 100).toFixed(0)}% confiance
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-300">
                          {fromProject?.name} → {toProject?.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {suggestion.reason}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="text-sm text-slate-400">
                Ces suggestions seront ajoutées au graphe existant
              </div>
              <Button onClick={applyAISuggestions}>
                Appliquer les suggestions
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
