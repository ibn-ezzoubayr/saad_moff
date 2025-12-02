# Constructeur ETL - Pipeline de Données

Application moderne et interactive de construction de pipelines ETL (Extract, Transform, Load) construite avec Angular 20 (Standalone Components) et Tailwind CSS.

## Fonctionnalités

### 🎨 Interface Utilisateur
- **Barre latérale gauche** : Palette de composants ETL organisés par catégorie avec code couleur
- **Canvas central** : Zone de glisser-déposer pour construire visuellement le pipeline
- **Panneau de propriétés** : Configuration détaillée des nœuds sélectionnés
- **Barre supérieure** : Actions principales (Exécuter, Générer avec IA, Sauvegarder)
- **Panneau inférieur** : Logs d'exécution et aperçu des données

### 📦 Catégories de Composants

1. **Extraction (Bleu)** : Fichier CSV, JSON, Connexion DB, API REST
2. **Filtrage (Violet)** : Filtrer lignes, Supprimer doublons, Nettoyer nulls
3. **Transformation (Orange)** : Calculer colonne, Normaliser, Agréger
4. **Fusion (Rose)** : Joindre tables, Union
5. **Exportation (Vert)** : Sauver fichier, Exporter vers DB

### 🤖 Génération IA

Le bouton "Générer avec IA" permet de créer automatiquement un pipeline à partir d'une description en langage naturel (en français).

**Exemples de prompts** :
- "Importer un fichier CSV et filtrer les lignes où le prix est supérieur à 100"
- "Charger des données JSON, supprimer les doublons, et exporter vers une base de données"
- "Connecter à une API, transformer les données, calculer les totaux, et sauver en CSV"

### 🎯 Fonctionnalités Interactives

- **Glisser-déposer** : Ajoutez des nœuds depuis la palette vers le canvas
- **Connexions visuelles** : Les nœuds sont automatiquement connectés avec des lignes SVG
- **Configuration en temps réel** : Modifiez les propriétés des nœuds via le panneau de droite
- **Exécution simulée** : Testez votre pipeline avec des données mockées
- **Prévisualisation** : Visualisez les résultats dans un tableau formaté
- **Logs détaillés** : Suivez l'exécution étape par étape

## Technologies Utilisées

- **Angular 20** avec Standalone Components API
- **Angular Signals** pour la gestion d'état réactive
- **Angular CDK Drag & Drop** pour les interactions glisser-déposer
- **Tailwind CSS** pour le style moderne et responsive
- **Lucide Angular** pour les icônes
- **TypeScript** pour la sûreté des types

## Installation

```bash
npm install
```

## Développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## Build

```bash
npm run build
```

## Structure du Projet

```
src/
├── components/
│   ├── sidebar.component.ts           # Palette de composants
│   ├── canvas.component.ts            # Zone de construction
│   ├── properties-panel.component.ts  # Configuration des nœuds
│   ├── header.component.ts            # Barre supérieure
│   └── bottom-panel.component.ts      # Logs et aperçu
├── services/
│   └── etl.service.ts                 # Logique métier du pipeline
├── types/
│   └── etl.types.ts                   # Définitions TypeScript
└── main.ts                            # Point d'entrée de l'application
```

## Interface en Français

Toutes les interfaces utilisateur sont en français, y compris :
- Labels et boutons
- Messages de logs
- Descriptions des composants
- Configuration des nœuds
