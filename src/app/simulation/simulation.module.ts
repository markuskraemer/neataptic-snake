import { GameViewComponent } from './components/game-view/game-view.component';
import { GameForegroundComponent } from './components/game-fg/game-fg.component';
import { GameBackgroudComponent } from './components/game-bg/game-bg.component';
import { SimulationComponent } from './simulation.component';
import { ConfigService } from './config.service';
import { TickService } from './tick.service';
import { KeyboardService } from './game/Keyboard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
      SimulationComponent,
      GameBackgroudComponent,
      GameForegroundComponent,
      GameViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
        SimulationComponent
  ],
  providers: [
      KeyboardService,
      TickService,
      ConfigService,
      FormsModule
  ]
})
export class SimulationModule { }
