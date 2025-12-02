import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Play, Sparkles, Save, Trash2, X } from 'lucide-angular';
import { EtlService } from '../services/etl.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Constructeur ETL</h1>
            <p class="text-xs text-gray-500">Pipeline de données moderne</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          (click)="openAiModal()"
          class="btn-ai">
          <lucide-icon [name]="'sparkles'" [size]="18"></lucide-icon>
          <span>Générer avec IA</span>
        </button>

        <button
          (click)="executePipeline()"
          class="btn-primary">
          <lucide-icon [name]="'play'" [size]="18"></lucide-icon>
          <span>Exécuter</span>
        </button>

        <button
          (click)="clearPipeline()"
          class="btn-secondary">
          <lucide-icon [name]="'trash-2'" [size]="18"></lucide-icon>
          <span>Effacer</span>
        </button>

        <button class="btn-secondary">
          <lucide-icon [name]="'save'" [size]="18"></lucide-icon>
          <span>Sauvegarder</span>
        </button>
      </div>
    </header>

    <div *ngIf="showAiModal()" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" (click)="closeAiModal()">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <lucide-icon [name]="'sparkles'" [size]="20" class="text-white"></lucide-icon>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Générateur IA</h2>
              <p class="text-sm text-gray-500">Décrivez votre pipeline en langage naturel</p>
            </div>
          </div>
          <button (click)="closeAiModal()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <lucide-icon [name]="'x'" [size]="20" class="text-gray-500"></lucide-icon>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Décrivez votre pipeline
            </label>
            <textarea
              [(ngModel)]="aiPrompt"
              class="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Exemple: Importer sales.csv, filtrer les prix supérieurs à 100, calculer le total par produit, et exporter vers un fichier JSON"></textarea>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <h3 class="text-sm font-semibold text-blue-900 mb-2">💡 Exemples de prompts</h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li class="cursor-pointer hover:text-blue-600" (click)="setPrompt('Importer un fichier CSV et filtrer les lignes où le prix est supérieur à 100')">
                • Importer un fichier CSV et filtrer les lignes où le prix est supérieur à 100
              </li>
              <li class="cursor-pointer hover:text-blue-600" (click)="setPrompt('Charger des données JSON, supprimer les doublons, et exporter vers une base de données')">
                • Charger des données JSON, supprimer les doublons, et exporter vers une base de données
              </li>
              <li class="cursor-pointer hover:text-blue-600" (click)="setPrompt('Connecter à une API, transformer les données, calculer les totaux, et sauver en CSV')">
                • Connecter à une API, transformer les données, calculer les totaux, et sauver en CSV
              </li>
            </ul>
          </div>

          <div class="flex justify-end gap-3">
            <button (click)="closeAiModal()" class="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium">
              Annuler
            </button>
            <button
              (click)="generatePipeline()"
              [disabled]="!aiPrompt.trim()"
              class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <lucide-icon [name]="'sparkles'" [size]="18"></lucide-icon>
              <span>Générer le pipeline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-primary {
      @apply flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-sm;
    }
    .btn-secondary {
      @apply flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium;
    }
    .btn-ai {
      @apply flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all font-medium shadow-sm;
    }
  `]
})
export class HeaderComponent {
  etlService = inject(EtlService);

  showAiModal = signal(false);
  aiPrompt = '';

  icons = {
    'play': Play,
    'sparkles': Sparkles,
    'save': Save,
    'trash-2': Trash2,
    'x': X
  };

  openAiModal() {
    this.showAiModal.set(true);
  }

  closeAiModal() {
    this.showAiModal.set(false);
  }

  setPrompt(prompt: string) {
    this.aiPrompt = prompt;
  }

  generatePipeline() {
    if (this.aiPrompt.trim()) {
      this.etlService.generateFromAI(this.aiPrompt);
      this.closeAiModal();
      this.aiPrompt = '';
    }
  }

  executePipeline() {
    this.etlService.executePipeline();
  }

  clearPipeline() {
    if (confirm('Êtes-vous sûr de vouloir effacer tout le pipeline ?')) {
      this.etlService.clearPipeline();
    }
  }
}
