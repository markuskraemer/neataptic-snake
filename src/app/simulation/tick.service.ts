import { Alias } from './Alias';
import { ConfigService } from './config.service';
import { Injectable, EventEmitter } from '@angular/core';


@Injectable()
export class TickService {

    private _ticks:number = 0;
    private intervalId:any;
    private _isRunning:boolean;
    private _fps:number = 60;
    public loopsPerTick:number = 1;
    public tick:EventEmitter<number> = new EventEmitter ();
    public draw:EventEmitter<null> = new EventEmitter ();

    public get fps ():number {
        return this._fps;
    }

    public set fps (value:number) {
        if(this._fps != value && value > 0){
            this._fps = value;
            this.start ();
        }
    }    

    public get ticks ():number {
        return this._ticks;
    }

    public get isRunning ():boolean {
        return this._isRunning;
    }

    public get updateTime ():number {
        return 1000 / this._fps;
    }

    constructor(
        private configService:ConfigService
    ) {
        Alias.tickService = this;
        this._fps = configService.fps;
       // this.start ();
     }

    private clearInterval ():void {
        clearInterval(this.intervalId);
    }

    public start ():void {
        this._isRunning = true;
        this.clearInterval ();
        this.intervalId = setInterval ( () => {

            for(let i:number = 0; i < this.loopsPerTick; ++i){
                this._ticks ++;
                this.tick.emit (1);
            }
            this.emitDraw ();
        }, this.updateTime);
    }

    public emitDraw ():void {
        this.draw.emit();
    }

    public stop ():void {
        this.clearInterval ();
        this._isRunning = false;
    }

}