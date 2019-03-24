import { Alias } from './Alias';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    constructor (){
        Alias.configService = this;
    }
    public readonly gamesPerGeneration:number = 24;
    public elitismPercent:number = .25;
    public offspringPercent:number = .5;
    public mutationRate:number = .4;
    public readonly autoRunNextgeneration:boolean = true;

    public width:number = 20;
    public height:number = 20;
    public readonly tileSize:number = 6;
    public readonly fps:number = 30;
    public readonly snakeStartLength:number = 3;

    public snakeEats:boolean = true;
    public snakeDiesOnHittingItself:boolean = true;

}