import { Game } from './Game';
import { Direction } from './../model/Direction.enum';
import { XY } from './../model/XY';
import { Alias } from './../Alias';

export class Snake {
    protected static count:number = 0;

    public id:string;
    public bodyParts:XY [] = [];
    public direction:Direction = Direction.Right;
    public hasEaten:boolean;
    public isDead:boolean;
    public ticks:number = 0;
    public noFoodTicks:number = 0; 
    public color:number;
    public game:Game;
    
    constructor () {
        this.id = '' + Snake.count ++; 
        const c:number = 0x777777;
        this.color = Math.floor(Math.random () * (c)) + c;
        this.bodyParts = [new XY ()];
    }

    public destroy ():void {
    }

    public setToGameStartValues (){

    }

    public setHeadPosition (pos:XY) {
        this.bodyParts[0] = new XY (pos.x, pos.y);
        for(let i:number = 1; i < Alias.configService.snakeStartLength; ++i){
            this.bodyParts[i] = new XY (pos.x - i, pos.y);
        }
    }


    public tick () {
        ++this.ticks;
        const newPos:XY = this.moveHead ();
        if(this.headIsOnMap (newPos)){
            
            if(Alias.configService.snakeEats){
                this.checkEat (newPos);
            }

            this.updateBodyParts (newPos);

            if(Alias.configService.snakeDiesOnHittingItself){
                if(this.findIndexInBody (this.bodyParts[0]) > 0){
                    this.isDead = true;
                    this.game.snakeDead ();                
                }
            }
        }else{
            this.isDead = true;
            this.game.snakeDead ();
        }       
    }

    private headIsOnMap (headPos:XY):boolean {
        if(headPos.x < 0 || headPos.x >= this.game.width || headPos.y < 0 || headPos.y >= this.game.height){
            return false;
        }
        return true;
    }

    public findIndexInBody (pos:XY):number {

        for(let i:number = 1; i < this.bodyParts.length; ++i){
            if(this.bodyParts[i].equals(pos))
                return i;
        }
        return -1;
    }

    public snakeContainsPos (pos:XY):boolean {
        return this.bodyParts.find ((value:XY) => {
            return value.x == pos.x && value.y == pos.y;
        }) != null;
    }

    private checkEat (headPos:XY):void {
        if(headPos.equals(this.game.foodPos)){
            this.hasEaten = true;
            this.game.eatFood ();
            this.noFoodTicks = 0;
        }else{
            this.hasEaten = false;
            this.noFoodTicks ++;
        }
    }



    private moveHead ():XY {
        let result:XY = this.bodyParts[0].clone ();
        let newX:number;
        let newY:number;
        switch(this.direction){
            case Direction.Up:
                newY  = this.bodyParts[0].y - 1;
                result.y = newY;    
                break;
            
            case Direction.Down:
                newY = this.bodyParts[0].y + 1;
                result.y = newY;    
                break;

            case Direction.Left:
                newX = this.bodyParts[0].x - 1;
                result.x = newX;    
                break;

            case Direction.Right:
                newX = this.bodyParts[0].x + 1;
                result.x = newX;    
                break;
        }
        return result;
    }

    private updateBodyParts (headPos:XY):void {

        if(this.hasEaten){
             this.bodyParts.push (this.bodyParts[this.bodyParts.length-1]);
        }
        for(let i:number = this.bodyParts.length-1; i > 0; --i){
            this.bodyParts[i] = this.bodyParts[i-1];
        }
        this.bodyParts[0] = headPos;
    }

}
