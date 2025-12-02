import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';
import { CanvasComponent } from './components/canvas.component';
import { PropertiesPanelComponent } from './components/properties-panel.component';
import { BottomPanelComponent } from './components/bottom-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    CanvasComponent,
    PropertiesPanelComponent,
    BottomPanelComponent
  ],
  template: `
    <div class="h-screen flex flex-col">
      <app-header></app-header>

      <div class="flex-1 flex overflow-hidden">
        <app-sidebar></app-sidebar>

        <div class="flex-1 flex flex-col">
          <div class="flex-1 overflow-hidden">
            <app-canvas></app-canvas>
          </div>
        </div>

        <app-properties-panel></app-properties-panel>
      </div>

      <app-bottom-panel></app-bottom-panel>
    </div>
  `,
  styles: []
})
export class App {}

bootstrapApplication(App, {
  providers: [provideAnimations()]
});
