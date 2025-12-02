import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { LucideAngularModule, FileText, FileJson, Database, Globe, Filter, CopyX, Eraser, Calculator, Maximize, Layers, Merge, GitMerge, Save, Upload, Trash2 } from 'lucide-angular';
import { EtlService } from '../services/etl.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDropList, LucideAngularModule],
  template: `
    <div class="relative w-full h-full bg-gray-50 overflow-auto"
         cdkDropList
         (cdkDropListDropped)="onDrop($event)">

      <div class="absolute inset-0" style="background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px); background-size: 20px 20px;"></div>

      <svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 1;">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
          </marker>
        </defs>
        <g *ngFor="let connection of connections()">
          <path
            [attr.d]="getConnectionPath(connection.from, connection.to)"
            stroke="#9ca3af"
            stroke-width="2"
            fill="none"
            marker-end="url(#arrowhead)"
          />
        </g>
      </svg>

      <div class="relative" style="z-index: 2;">
        <div *ngFor="let node of nodes()"
             cdkDrag
             [cdkDragFreeDragPosition]="node.position"
             (cdkDragEnded)="onNodeDragEnd($event, node.id)"
             (click)="selectNode(node.id)"
             [class]="getNodeClass(node)"
             class="absolute cursor-move select-none">

          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <lucide-icon [name]="node.icon" [size]="18"></lucide-icon>
              <span class="font-medium text-sm">{{ node.label }}</span>
            </div>
            <button (click)="deleteNode($event, node.id)" class="p-1 hover:bg-black/10 rounded transition-colors">
              <lucide-icon [name]="'trash-2'" [size]="14"></lucide-icon>
            </button>
          </div>

          <div class="text-xs opacity-75">
            ID: {{ node.id }}
          </div>

          <div *ngIf="node.connectedTo && node.connectedTo.length > 0" class="text-xs opacity-60 mt-1">
            → {{ node.connectedTo.length }} connexion(s)
          </div>
        </div>
      </div>

      <div *ngIf="nodes().length === 0" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="text-center text-gray-400">
          <p class="text-lg font-medium mb-2">Canvas vide</p>
          <p class="text-sm">Glissez-déposez des composants depuis la barre latérale</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .node-blue {
      @apply w-56 p-4 bg-blue-50 border-2 border-blue-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-blue-900;
    }
    .node-purple {
      @apply w-56 p-4 bg-purple-50 border-2 border-purple-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-purple-900;
    }
    .node-orange {
      @apply w-56 p-4 bg-orange-50 border-2 border-orange-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-orange-900;
    }
    .node-pink {
      @apply w-56 p-4 bg-pink-50 border-2 border-pink-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-pink-900;
    }
    .node-green {
      @apply w-56 p-4 bg-green-50 border-2 border-green-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-green-900;
    }
    .node-selected {
      @apply ring-4 ring-indigo-400 ring-opacity-50;
    }
  `]
})
export class CanvasComponent {
  etlService = inject(EtlService);

  nodes = computed(() => this.etlService.pipelineState().nodes);
  connections = computed(() => this.etlService.pipelineState().connections);
  selectedNodeId = computed(() => this.etlService.pipelineState().selectedNodeId);

  icons = {
    'file-text': FileText,
    'file-json': FileJson,
    'database': Database,
    'globe': Globe,
    'filter': Filter,
    'copy-x': CopyX,
    'eraser': Eraser,
    'calculator': Calculator,
    'maximize': Maximize,
    'layers': Layers,
    'merge': Merge,
    'git-merge': GitMerge,
    'save': Save,
    'upload': Upload,
    'trash-2': Trash2
  };

  onDrop(event: CdkDragDrop<any>) {
    const nodeType = event.item.data;
    if (nodeType) {
      const rect = (event.event.target as HTMLElement).getBoundingClientRect();
      const x = event.dropPoint.x - rect.left - 112;
      const y = event.dropPoint.y - rect.top - 40;
      this.etlService.addNode(nodeType.id, { x, y });
    }
  }

  onNodeDragEnd(event: any, nodeId: string) {
    const position = event.source.getFreeDragPosition();
    this.etlService.updateNodePosition(nodeId, position);
  }

  selectNode(nodeId: string) {
    this.etlService.selectNode(nodeId);
  }

  deleteNode(event: Event, nodeId: string) {
    event.stopPropagation();
    this.etlService.deleteNode(nodeId);
  }

  getNodeClass(node: any): string {
    let className = `node-${node.color}`;
    if (node.id === this.selectedNodeId()) {
      className += ' node-selected';
    }
    return className;
  }

  getConnectionPath(fromId: string, toId: string): string {
    const fromNode = this.nodes().find(n => n.id === fromId);
    const toNode = this.nodes().find(n => n.id === toId);

    if (!fromNode || !toNode) return '';

    const startX = fromNode.position.x + 224;
    const startY = fromNode.position.y + 50;
    const endX = toNode.position.x;
    const endY = toNode.position.y + 50;

    const midX = (startX + endX) / 2;

    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
  }
}
