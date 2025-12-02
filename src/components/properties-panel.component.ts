import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Settings } from 'lucide-angular';
import { EtlService } from '../services/etl.service';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div class="p-4">
        <div class="flex items-center gap-2 mb-4">
          <lucide-icon [name]="'settings'" [size]="20" class="text-gray-600"></lucide-icon>
          <h2 class="text-lg font-semibold text-gray-800">Propriétés</h2>
        </div>

        <div *ngIf="!selectedNode()" class="text-center text-gray-400 py-8">
          <p class="text-sm">Sélectionnez un nœud pour voir ses propriétés</p>
        </div>

        <div *ngIf="selectedNode()" class="space-y-4">
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="text-xs text-gray-500 uppercase font-semibold mb-1">Type</div>
            <div class="text-sm font-medium text-gray-800">{{ selectedNode()?.label }}</div>
          </div>

          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="text-xs text-gray-500 uppercase font-semibold mb-1">ID</div>
            <div class="text-sm font-mono text-gray-600">{{ selectedNode()?.id }}</div>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Configuration</h3>

            <div [ngSwitch]="selectedNode()?.typeId" class="space-y-3">

              <ng-container *ngSwitchCase="'csv-input'">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Séparateur</label>
                  <select
                    [(ngModel)]="config.separator"
                    (ngModelChange)="updateConfig()"
                    class="input-field">
                    <option value=",">Virgule (,)</option>
                    <option value=";">Point-virgule (;)</option>
                    <option value="\t">Tabulation</option>
                  </select>
                </div>
                <div>
                  <label class="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      [(ngModel)]="config.hasHeader"
                      (ngModelChange)="updateConfig()"
                      class="rounded">
                    Première ligne en-tête
                  </label>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Fichier</label>
                  <button class="btn-secondary text-sm">Téléverser fichier</button>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'json-input'">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Format</label>
                  <select [(ngModel)]="config.format" (ngModelChange)="updateConfig()" class="input-field">
                    <option value="array">Tableau</option>
                    <option value="object">Objet</option>
                    <option value="ndjson">NDJSON</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Fichier</label>
                  <button class="btn-secondary text-sm">Téléverser fichier</button>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'db-connection'">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Type de base</label>
                  <select [(ngModel)]="config.dbType" (ngModelChange)="updateConfig()" class="input-field">
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="mongodb">MongoDB</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Requête SQL</label>
                  <textarea
                    [(ngModel)]="config.query"
                    (ngModelChange)="updateConfig()"
                    class="input-field h-20"
                    placeholder="SELECT * FROM table"></textarea>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'api-input'">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="text"
                    [(ngModel)]="config.url"
                    (ngModelChange)="updateConfig()"
                    class="input-field"
                    placeholder="https://api.example.com/data">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Méthode</label>
                  <select [(ngModel)]="config.method" (ngModelChange)="updateConfig()" class="input-field">
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'filter-rows'">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Colonne</label>
                  <input
                    type="text"
                    [(ngModel)]="config.column"
                    (ngModelChange)="updateConfig()"
                    class="input-field"
                    placeholder="nom_colonne">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Opérateur</label>
                  <select [(ngModel)]="config.operator" (ngModelChange)="updateConfig()" class="input-field">
                    <option value=">">&gt; (supérieur)</option>
                    <option value="<">&lt; (inférieur)</option>
                    <option value="=">=  (égal)</option>
                    <option value="!=">!= (différent)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Valeur</label>
                  <input
                    type="text"
                    [(ngModel)]="config.value"
                    (ngModelChange)="updateConfig()"
                    class="input-field"
                    placeholder="100">
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'calculate-column'">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Nouvelle colonne</label>
                  <input
                    type="text"
                    [(ngModel)]="config.newColumn"
                    (ngModelChange)="updateConfig()"
                    class="input-field"
                    placeholder="resultat">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Formule</label>
                  <input
                    type="text"
                    [(ngModel)]="config.formula"
                    (ngModelChange)="updateConfig()"
                    class="input-field"
                    placeholder="price * quantity">
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'aggregate'">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Grouper par</label>
                  <input
                    type="text"
                    [(ngModel)]="config.groupBy"
                    (ngModelChange)="updateConfig()"
                    class="input-field"
                    placeholder="category">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Fonction</label>
                  <select [(ngModel)]="config.aggregateFunc" (ngModelChange)="updateConfig()" class="input-field">
                    <option value="sum">Somme</option>
                    <option value="avg">Moyenne</option>
                    <option value="count">Compter</option>
                    <option value="min">Minimum</option>
                    <option value="max">Maximum</option>
                  </select>
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'join-tables'">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Type de jointure</label>
                  <select [(ngModel)]="config.joinType" (ngModelChange)="updateConfig()" class="input-field">
                    <option value="inner">Inner Join</option>
                    <option value="left">Left Join</option>
                    <option value="right">Right Join</option>
                    <option value="full">Full Join</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Clé gauche</label>
                  <input
                    type="text"
                    [(ngModel)]="config.leftKey"
                    (ngModelChange)="updateConfig()"
                    class="input-field"
                    placeholder="id">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Clé droite</label>
                  <input
                    type="text"
                    [(ngModel)]="config.rightKey"
                    (ngModelChange)="updateConfig()"
                    class="input-field"
                    placeholder="user_id">
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'save-file'">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Nom du fichier</label>
                  <input
                    type="text"
                    [(ngModel)]="config.filename"
                    (ngModelChange)="updateConfig()"
                    class="input-field"
                    placeholder="output.csv">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Format</label>
                  <select [(ngModel)]="config.format" (ngModelChange)="updateConfig()" class="input-field">
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="excel">Excel</option>
                  </select>
                </div>
              </ng-container>

              <ng-container *ngSwitchDefault>
                <p class="text-sm text-gray-500">Aucune configuration disponible pour ce type de nœud.</p>
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input-field {
      @apply w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
    }
    .btn-secondary {
      @apply w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium;
    }
  `]
})
export class PropertiesPanelComponent {
  etlService = inject(EtlService);

  icons = { 'settings': Settings };

  selectedNode = computed(() => {
    const state = this.etlService.pipelineState();
    return state.nodes.find(n => n.id === state.selectedNodeId);
  });

  config: any = {};

  ngOnInit() {
    this.loadConfig();
  }

  ngDoCheck() {
    const node = this.selectedNode();
    if (node && JSON.stringify(this.config) !== JSON.stringify(node.config)) {
      this.loadConfig();
    }
  }

  loadConfig() {
    const node = this.selectedNode();
    if (node) {
      this.config = { ...node.config };
    }
  }

  updateConfig() {
    const node = this.selectedNode();
    if (node) {
      this.etlService.updateNodeConfig(node.id, this.config);
    }
  }
}
