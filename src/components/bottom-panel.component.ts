import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronUp, ChevronDown, Terminal, Table } from 'lucide-angular';
import { EtlService } from '../services/etl.service';

@Component({
  selector: 'app-bottom-panel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white border-t border-gray-200">
      <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
           (click)="togglePanel()">
        <div class="flex items-center gap-4">
          <button class="flex items-center gap-2 text-sm font-medium text-gray-700">
            <lucide-icon [name]="isExpanded() ? 'chevron-down' : 'chevron-up'" [size]="18"></lucide-icon>
            <span>{{ isExpanded() ? 'Masquer' : 'Afficher' }} le panneau</span>
          </button>

          <div class="flex gap-2">
            <button
              (click)="setActiveTab('logs'); $event.stopPropagation()"
              [class]="activeTab() === 'logs' ? 'tab-active' : 'tab-inactive'">
              <lucide-icon [name]="'terminal'" [size]="16"></lucide-icon>
              <span>Logs</span>
              <span class="badge">{{ etlService.logs().length }}</span>
            </button>
            <button
              (click)="setActiveTab('preview'); $event.stopPropagation()"
              [class]="activeTab() === 'preview' ? 'tab-active' : 'tab-inactive'">
              <lucide-icon [name]="'table'" [size]="16"></lucide-icon>
              <span>Aperçu</span>
              <span class="badge">{{ etlService.previewData().length }}</span>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="isExpanded()" class="h-64 overflow-auto">

        <div *ngIf="activeTab() === 'logs'" class="p-4 font-mono text-xs space-y-1">
          <div *ngIf="etlService.logs().length === 0" class="text-gray-400 text-center py-8">
            Aucun log disponible. Exécutez le pipeline pour voir les logs.
          </div>
          <div *ngFor="let log of etlService.logs()" class="text-gray-700 hover:bg-gray-50 px-2 py-1 rounded">
            {{ log }}
          </div>
        </div>

        <div *ngIf="activeTab() === 'preview'" class="p-4">
          <div *ngIf="etlService.previewData().length === 0" class="text-gray-400 text-center py-8">
            Aucune donnée à prévisualiser. Exécutez le pipeline pour voir les résultats.
          </div>

          <div *ngIf="etlService.previewData().length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th *ngFor="let key of getKeys()"
                      class="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {{ key }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let row of etlService.previewData()" class="hover:bg-gray-50">
                  <td *ngFor="let key of getKeys()" class="px-4 py-2 text-gray-600">
                    {{ row[key] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tab-inactive {
      @apply flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors;
    }
    .tab-active {
      @apply flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 font-medium rounded-md;
    }
    .badge {
      @apply px-1.5 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full;
    }
    .tab-active .badge {
      @apply bg-blue-200 text-blue-700;
    }
  `]
})
export class BottomPanelComponent {
  etlService = inject(EtlService);

  isExpanded = signal(false);
  activeTab = signal<'logs' | 'preview'>('logs');

  icons = {
    'chevron-up': ChevronUp,
    'chevron-down': ChevronDown,
    'terminal': Terminal,
    'table': Table
  };

  togglePanel() {
    this.isExpanded.update(val => !val);
  }

  setActiveTab(tab: 'logs' | 'preview') {
    this.activeTab.set(tab);
  }

  getKeys(): string[] {
    const data = this.etlService.previewData();
    return data.length > 0 ? Object.keys(data[0]) : [];
  }
}
