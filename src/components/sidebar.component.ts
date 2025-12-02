import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { LucideAngularModule, FileText, FileJson, Database, Globe, Filter, CopyX, Eraser, Calculator, Maximize, Layers, Merge, GitMerge, Save, Upload } from 'lucide-angular';
import { EtlService } from '../services/etl.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CdkDrag, LucideAngularModule],
  template: `
    <div class="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Composants ETL</h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-xs font-semibold text-blue-600 uppercase mb-2 flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-blue-500"></div>
              Extraction
            </h3>
            <div class="space-y-2">
              <div *ngFor="let node of getNodesByCategory('extraction')"
                   cdkDrag
                   [cdkDragData]="node"
                   class="node-item bg-blue-50 border border-blue-200 hover:bg-blue-100">
                <lucide-icon [name]="node.icon" [size]="16" class="text-blue-600"></lucide-icon>
                <span class="text-sm text-blue-900">{{ node.label }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-semibold text-purple-600 uppercase mb-2 flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-purple-500"></div>
              Filtrage
            </h3>
            <div class="space-y-2">
              <div *ngFor="let node of getNodesByCategory('filtrage')"
                   cdkDrag
                   [cdkDragData]="node"
                   class="node-item bg-purple-50 border border-purple-200 hover:bg-purple-100">
                <lucide-icon [name]="node.icon" [size]="16" class="text-purple-600"></lucide-icon>
                <span class="text-sm text-purple-900">{{ node.label }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-semibold text-orange-600 uppercase mb-2 flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-orange-500"></div>
              Transformation
            </h3>
            <div class="space-y-2">
              <div *ngFor="let node of getNodesByCategory('transformation')"
                   cdkDrag
                   [cdkDragData]="node"
                   class="node-item bg-orange-50 border border-orange-200 hover:bg-orange-100">
                <lucide-icon [name]="node.icon" [size]="16" class="text-orange-600"></lucide-icon>
                <span class="text-sm text-orange-900">{{ node.label }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-semibold text-pink-600 uppercase mb-2 flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-pink-500"></div>
              Fusion
            </h3>
            <div class="space-y-2">
              <div *ngFor="let node of getNodesByCategory('merging')"
                   cdkDrag
                   [cdkDragData]="node"
                   class="node-item bg-pink-50 border border-pink-200 hover:bg-pink-100">
                <lucide-icon [name]="node.icon" [size]="16" class="text-pink-600"></lucide-icon>
                <span class="text-sm text-pink-900">{{ node.label }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-semibold text-green-600 uppercase mb-2 flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              Exportation
            </h3>
            <div class="space-y-2">
              <div *ngFor="let node of getNodesByCategory('exportation')"
                   cdkDrag
                   [cdkDragData]="node"
                   class="node-item bg-green-50 border border-green-200 hover:bg-green-100">
                <lucide-icon [name]="node.icon" [size]="16" class="text-green-600"></lucide-icon>
                <span class="text-sm text-green-900">{{ node.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .node-item {
      @apply p-3 rounded-lg cursor-move flex items-center gap-3 transition-colors;
    }
    .node-item:active {
      @apply cursor-grabbing;
    }
  `]
})
export class SidebarComponent {
  etlService = inject(EtlService);

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
    'upload': Upload
  };

  getNodesByCategory(category: string) {
    return this.etlService.nodeTypes.filter(n => n.category === category);
  }
}
