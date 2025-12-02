import { Injectable, signal } from '@angular/core';
import { NodeType, CanvasNode, Connection, PipelineState } from '../types/etl.types';

@Injectable({
  providedIn: 'root'
})
export class EtlService {
  private nodeCounter = 0;

  nodeTypes: NodeType[] = [
    { id: 'csv-input', label: 'Fichier CSV', category: 'extraction', icon: 'file-text', color: 'blue' },
    { id: 'json-input', label: 'Fichier JSON', category: 'extraction', icon: 'file-json', color: 'blue' },
    { id: 'db-connection', label: 'Connexion DB', category: 'extraction', icon: 'database', color: 'blue' },
    { id: 'api-input', label: 'API REST', category: 'extraction', icon: 'globe', color: 'blue' },

    { id: 'filter-rows', label: 'Filtrer lignes', category: 'filtrage', icon: 'filter', color: 'purple' },
    { id: 'remove-duplicates', label: 'Supprimer doublons', category: 'filtrage', icon: 'copy-x', color: 'purple' },
    { id: 'clean-nulls', label: 'Nettoyer nulls', category: 'filtrage', icon: 'eraser', color: 'purple' },

    { id: 'calculate-column', label: 'Calculer colonne', category: 'transformation', icon: 'calculator', color: 'orange' },
    { id: 'normalize', label: 'Normaliser', category: 'transformation', icon: 'maximize', color: 'orange' },
    { id: 'aggregate', label: 'Agréger', category: 'transformation', icon: 'layers', color: 'orange' },

    { id: 'join-tables', label: 'Joindre tables', category: 'merging', icon: 'merge', color: 'pink' },
    { id: 'union', label: 'Union', category: 'merging', icon: 'git-merge', color: 'pink' },

    { id: 'save-file', label: 'Sauver fichier', category: 'exportation', icon: 'save', color: 'green' },
    { id: 'export-db', label: 'Exporter vers DB', category: 'exportation', icon: 'upload', color: 'green' }
  ];

  pipelineState = signal<PipelineState>({
    nodes: [],
    connections: [],
    selectedNodeId: null
  });

  logs = signal<string[]>([]);
  previewData = signal<any[]>([]);

  addNode(typeId: string, position: { x: number; y: number }) {
    const nodeType = this.nodeTypes.find(t => t.id === typeId);
    if (!nodeType) return;

    const newNode: CanvasNode = {
      id: `node-${++this.nodeCounter}`,
      typeId: nodeType.id,
      label: nodeType.label,
      category: nodeType.category,
      icon: nodeType.icon,
      color: nodeType.color,
      position,
      config: this.getDefaultConfig(typeId),
      connectedTo: []
    };

    this.pipelineState.update(state => ({
      ...state,
      nodes: [...state.nodes, newNode]
    }));
  }

  selectNode(nodeId: string | null) {
    this.pipelineState.update(state => ({
      ...state,
      selectedNodeId: nodeId
    }));
  }

  updateNodeConfig(nodeId: string, config: Record<string, any>) {
    this.pipelineState.update(state => ({
      ...state,
      nodes: state.nodes.map(node =>
        node.id === nodeId ? { ...node, config: { ...node.config, ...config } } : node
      )
    }));
  }

  updateNodePosition(nodeId: string, position: { x: number; y: number }) {
    this.pipelineState.update(state => ({
      ...state,
      nodes: state.nodes.map(node =>
        node.id === nodeId ? { ...node, position } : node
      )
    }));
  }

  connectNodes(fromId: string, toId: string) {
    this.pipelineState.update(state => ({
      ...state,
      connections: [...state.connections, { from: fromId, to: toId }],
      nodes: state.nodes.map(node =>
        node.id === fromId
          ? { ...node, connectedTo: [...(node.connectedTo || []), toId] }
          : node
      )
    }));
  }

  deleteNode(nodeId: string) {
    this.pipelineState.update(state => ({
      ...state,
      nodes: state.nodes.filter(node => node.id !== nodeId),
      connections: state.connections.filter(conn => conn.from !== nodeId && conn.to !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId
    }));
  }

  clearPipeline() {
    this.pipelineState.set({
      nodes: [],
      connections: [],
      selectedNodeId: null
    });
    this.logs.set([]);
    this.previewData.set([]);
  }

  executePipeline() {
    this.logs.set([]);
    const state = this.pipelineState();

    this.addLog('🚀 Démarrage du pipeline...');

    const mockData = [
      { id: 1, product: 'Laptop', price: 1200, quantity: 5, category: 'Electronics' },
      { id: 2, product: 'Mouse', price: 25, quantity: 150, category: 'Electronics' },
      { id: 3, product: 'Keyboard', price: 75, quantity: 80, category: 'Electronics' },
      { id: 4, product: 'Monitor', price: 300, quantity: 40, category: 'Electronics' },
      { id: 5, product: 'Chair', price: 200, quantity: 30, category: 'Furniture' }
    ];

    let processedData = [...mockData];

    state.nodes.forEach((node, index) => {
      this.addLog(`📦 Étape ${index + 1}: ${node.label}`);

      switch (node.category) {
        case 'extraction':
          this.addLog(`✅ Extraction: ${processedData.length} lignes chargées`);
          break;

        case 'filtrage':
          if (node.typeId === 'filter-rows' && node.config['column'] && node.config['value']) {
            const before = processedData.length;
            const column = node.config['column'];
            const value = node.config['value'];
            processedData = processedData.filter((row: any) =>
              row[column] > parseInt(value)
            );
            this.addLog(`✅ Filtrage: ${before} → ${processedData.length} lignes`);
          } else if (node.typeId === 'remove-duplicates') {
            const before = processedData.length;
            processedData = Array.from(new Set(processedData.map((item: any) => JSON.stringify(item)))).map((str: string) => JSON.parse(str));
            this.addLog(`✅ Doublons supprimés: ${before} → ${processedData.length} lignes`);
          }
          break;

        case 'transformation':
          if (node.typeId === 'calculate-column') {
            processedData = processedData.map(row => ({
              ...row,
              total: (row.price || 0) * (row.quantity || 0)
            }));
            this.addLog(`✅ Transformation: Colonne 'total' ajoutée`);
          }
          break;

        case 'exportation':
          this.addLog(`✅ Exportation: ${processedData.length} lignes exportées`);
          break;
      }
    });

    this.previewData.set(processedData);
    this.addLog('✨ Pipeline exécuté avec succès!');
  }

  generateFromAI(prompt: string) {
    this.clearPipeline();
    this.addLog(`🤖 Génération IA: "${prompt}"`);

    const lowerPrompt = prompt.toLowerCase();
    let yOffset = 100;

    if (lowerPrompt.includes('csv') || lowerPrompt.includes('fichier')) {
      this.addNode('csv-input', { x: 100, y: yOffset });
      yOffset += 120;
    }

    if (lowerPrompt.includes('filtr') || lowerPrompt.includes('prix') || lowerPrompt.includes('price')) {
      this.addNode('filter-rows', { x: 100, y: yOffset });
      const filterNode = this.pipelineState().nodes[this.pipelineState().nodes.length - 1];
      if (lowerPrompt.match(/>\s*(\d+)/)) {
        const value = lowerPrompt.match(/>\s*(\d+)/)?.[1];
        this.updateNodeConfig(filterNode.id, { column: 'price', operator: '>', value });
      }
      yOffset += 120;
    }

    if (lowerPrompt.includes('calcul') || lowerPrompt.includes('total')) {
      this.addNode('calculate-column', { x: 100, y: yOffset });
      yOffset += 120;
    }

    if (lowerPrompt.includes('export') || lowerPrompt.includes('sauv')) {
      this.addNode('save-file', { x: 100, y: yOffset });
    }

    const nodes = this.pipelineState().nodes;
    for (let i = 0; i < nodes.length - 1; i++) {
      this.connectNodes(nodes[i].id, nodes[i + 1].id);
    }

    this.addLog(`✅ ${nodes.length} nœuds générés automatiquement`);
  }

  private addLog(message: string) {
    this.logs.update(logs => [...logs, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }

  private getDefaultConfig(typeId: string): Record<string, any> {
    switch (typeId) {
      case 'csv-input':
        return { separator: ',', hasHeader: true };
      case 'filter-rows':
        return { column: '', operator: '>', value: '' };
      case 'calculate-column':
        return { newColumn: 'result', formula: '' };
      case 'join-tables':
        return { joinType: 'inner', leftKey: '', rightKey: '' };
      default:
        return {};
    }
  }
}
