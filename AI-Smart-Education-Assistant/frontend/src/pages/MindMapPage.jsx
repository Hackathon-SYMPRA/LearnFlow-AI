import React, { useState, useCallback, useRef, useEffect } from "react";
import { Network, Download, FileText, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import * as htmlToImage from "html-to-image";
import { documentService, aiService } from "../services";

export const MindMapPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await documentService.list();
        setDocuments(response.data || []);
      } catch (err) {
        toast.error("Failed to load documents");
      }
    };
    fetchDocs();
  }, []);

  const handleGenerate = async () => {
    if (!selectedDoc) {
      toast.error("Please select a document first");
      return;
    }
    
    setIsGenerating(true);
    setIsGenerated(false);
    
    try {
      const response = await aiService.generateMindMap(selectedDoc);
      let data = response.data?.mindmap || response.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data.replace(/```json/g, "").replace(/```/g, ""));
        } catch (e) {
          // Ignore parse error
        }
      }
      
      if (data && data.nodes && data.edges) {
        setNodes(data.nodes);
        setEdges(data.edges);
        setIsGenerated(true);
        toast.success("Mind Map generated successfully!");
      } else {
        toast.error("Failed to parse mind map data");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate mind map");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (reactFlowWrapper.current === null) return;

    htmlToImage.toPng(reactFlowWrapper.current, {
        backgroundColor: '#ffffff',
        width: reactFlowWrapper.current.offsetWidth,
        height: reactFlowWrapper.current.offsetHeight,
      })
      .then((dataUrl) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'MindMap.png';
        a.click();
        toast.success("Mind map downloaded successfully!");
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
        toast.error("Failed to download image");
      });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900/50">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Network className="h-5 w-5 text-primary-500" />
            AI Mind Map Generator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Visualize concepts and connections from your study materials
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div className="w-80 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shrink-0 flex flex-col gap-6 relative z-10 shadow-sm">
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Select Study Material
            </label>
            <div className="relative">
              <select 
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                value={selectedDoc}
                onChange={(e) => setSelectedDoc(e.target.value)}
              >
                <option value="" disabled>Choose a document...</option>
                {documents.map(doc => (
                  <option key={doc._id || doc.id} value={doc._id || doc.id}>{doc.original_name || doc.file_name || doc.filename || doc.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-medium text-sm text-slate-900 dark:text-white mb-2">How it works</h4>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <li>1. AI scans your document for key topics.</li>
              <li>2. It builds a hierarchical relationship of concepts.</li>
              <li>3. You can pan, zoom, and explore the interactive graph.</li>
            </ul>
          </div>

          <div className="mt-auto pt-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Network className="h-4 w-4" />
                  Generate Mind Map
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Content - Output */}
        <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900 relative">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                key="generating"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-20"
              >
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-primary-500 dark:border-slate-700 dark:border-t-primary-500 mb-6" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Mapping Concepts...</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Building relationship trees from your document</p>
              </motion.div>
            ) : isGenerated ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="w-full h-full relative"
                ref={reactFlowWrapper}
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  className="bg-slate-50 dark:bg-slate-900"
                >
                  <Background color="#ccc" gap={16} />
                  <Controls className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm" />
                  <MiniMap 
                    nodeStrokeColor={(n) => {
                      if (n.style?.background) return n.style.background;
                      return '#eee';
                    }}
                    nodeColor={(n) => {
                      if (n.style?.background) return n.style.background;
                      return '#fff';
                    }}
                    nodeBorderRadius={2}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <Panel position="top-right" className="m-4">
                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                      <Download className="h-4 w-4" />
                      Export as Image
                    </button>
                  </Panel>
                </ReactFlow>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col items-center justify-center text-center p-8"
              >
                <div className="h-24 w-24 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-full flex items-center justify-center mb-6">
                  <Network className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No Mind Map Generated Yet</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg">
                  Select a document from the left panel and click generate to visualize the core concepts and their relationships.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
