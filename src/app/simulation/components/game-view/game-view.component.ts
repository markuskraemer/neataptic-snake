import { ConfigService } from './../../config.service';
import { Game } from './../../game/Game';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {

    @Input ()
    public game:Game;    

    constructor(
        public configService:ConfigService
    ) { }

    ngOnInit() {
    }

}
