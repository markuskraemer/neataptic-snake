import { AiSnake3_2 } from './game/AiSnake3_2';
import { KeyboardService } from './game/Keyboard.service';
import { PlayerSnake } from './game/PlayerSnake';
import { Snake } from './game/Snake';
import { Alias } from './Alias';
import { Game } from './game/Game';
import { TickService } from './tick.service';
import { ConfigService } from './config.service';
import { Component } from '@angular/core';
import { architect, methods, Neat } from 'neataptic';

@Component({
  selector: 'simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent {
    
    private _neat:Neat;
    private _useFastMode:boolean;
    private _tickSub:any;

    public games:Game[] = [];

    constructor(
        public configService:ConfigService,
        public tickService:TickService,
        private keyboardService:KeyboardService
    ){
        this.tickService.start ();
        this.createGames ();
        this.initNeat ();
        this.startEvaluation ();
    }

    private initNeat () {

        const inputs = 5;
        const outputs = 3;
        const hidden = inputs + outputs + 2;        
        
        this._neat = new Neat (
            inputs, 
            outputs, 
            (network) => { 
                return network.score; 
            },
            {
                mutation: methods.mutation.ALL,
                popsize: Alias.configService.gamesPerGeneration,
                mutationRate: Alias.configService.mutationRate,
                elitism: Math.round(Alias.configService.elitismPercent * Alias.configService.gamesPerGeneration),
                network: new architect.Random (
                    inputs,
                    hidden,
                    outputs
                )
            }
        )
    }

    private startEvaluation() {
        //console.log('startEvalution: ', this._neat.population);
        for(let i = 0; i < this._neat.population.length; ++i) {
            let snake = new AiSnake3_2 (this._neat.population[i]);
            this.games[i].start (snake);
        }

        if(this._tickSub){
            this._tickSub.unsubscribe ();
        }

        this._tickSub = Alias.tickService.tick.subscribe ( () => {
            let hasRunning = false;
            for(let game of this.games){
                if(game.isRunning){
                    hasRunning = true;
                }
            }
            if(!hasRunning){
                this._tickSub.unsubscribe ();
                this.endEvaluation ();
            }
        })
    }

    private endEvaluation(){
        console.log('**** endEvaluation Generation: ' + this._neat.generation + '- average score:', this._neat.getAverage());

        for(let game of this.games){
            game.stop();
        }


        this._neat.sort();
        var newPopulation = [];

        for(let n of this._neat.population){
           // console.log(' ' + n.score);
        }

        const inputs = 5;
        const outputs = 3;
        const hidden = inputs + outputs + 4;        

        for(var i = 0; i < this._neat.popsize; i++){
            if(i < this._neat.popsize * Alias.configService.elitismPercent){
                newPopulation.push(this._neat.population[i]);            
            }else if(i < this._neat.popsize * (Alias.configService.elitismPercent + Alias.configService.offspringPercent)){
                newPopulation.push(this._neat.getOffspring());
            }else{
                newPopulation.push(new architect.Random (
                    inputs,
                    hidden,
                    outputs
                ))
            }
        }

        // Replace the old population with the new population
        
       // console.log(this._neat.popsize , ' newPopulation ', newPopulation)
        this._neat.population = newPopulation;
        this._neat.mutate();

        this._neat.generation++;

        setTimeout(() => this.startEvaluation (),500);
    }


    private createGames (){
        while(this.games.length < Alias.configService.gamesPerGeneration){
            this.games.push (new Game (Alias.configService.width, Alias.configService.height));
        }
    }

    public getInfo ():void {
    }

    public set useFastMode (value:boolean){
        if(this._useFastMode != value){
            this._useFastMode = value;

            if(this._useFastMode){
                this.tickService.fps = 40;
                this.tickService.loopsPerTick = 100;
            }else{
                this.tickService.fps = 15;
                this.tickService.loopsPerTick = 1;                
            }
        }
    }

    public get useFastMode (){
        return this._useFastMode;
    }

}
