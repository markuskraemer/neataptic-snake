import { MathUtils } from './../utils/MathUtils';
import { Alias } from './../Alias';
import { Direction } from './../model/Direction.enum';
import { XY } from './../model/XY';
import { Snake } from './Snake';
import { Network } from 'neataptic';
import { getHottestIndex } from './../utils/Utils';

export class AiSnake3_2 extends Snake {

    constructor (public brain:Network){
        
        super ();
        this.brain.score = 0;
        this.direction = Math.floor(Math.random () * 4);
    }

    public tick ():void {
        const input = this.calcInput ();
        const output = this.brain.activate (input);
        const hottestIdx = getHottestIndex(output);
        
        this.setDirection (hottestIdx);


        // console.log('tick input: ', input, output, this.direction);
        super.tick ();
        const score = this.calcScore (input, hottestIdx);
        if(this.noFoodTicks > 100){
            this.brain.score /= 4;
            this.isDead = true;
            this.game.snakeDead ();                
        }else{
            this.brain.score += score;
        }

    }

    private setDirection (hottestIdx:Direction){
        switch(this.direction){ 
            case Direction.Up:
                this.direction = hottestIdx;
                break;

            case Direction.Down:
                if(hottestIdx == Direction.Left){
                    this.direction = Direction.Right;
                }else if(hottestIdx == Direction.Right) {
                    this.direction = Direction.Left;
                }
                break;

            case Direction.Left:
                if(hottestIdx == Direction.Left){
                    this.direction = Direction.Down;
                }else if(hottestIdx == Direction.Right) {
                    this.direction = Direction.Up;
                }
                break;

            case Direction.Right:
                if(hottestIdx == Direction.Left){
                    this.direction = Direction.Up;
                }else if(hottestIdx == Direction.Right) {
                    this.direction = Direction.Down;
                }
                break;
        }    
    }




    private calcScore (input:number[], hottestIdx:number):number {
        const headPos:XY = this.bodyParts[0];
        const foodPos:XY = this.game.foodPos;
        const distFoodHorizontal:number = foodPos.x - headPos.x;
        const distFoodVertical:number = foodPos.y - headPos.y;
        let score:number = 1;
        const punishment = 2;
        if(!Alias.configService.snakeEats){
            return score;
        }

        score ++;

        if(this.hasEaten){
            score += 100;
        }

        return score;
    }


    


    private calcInput ():number[] {
        const headPos:XY = this.bodyParts[0];
        const foodPos:XY = this.game.foodPos;
        let input:number[];

        const leftFree:number = (headPos.x > 1) ? 1 : 0;
        const rightFree:number = (headPos.x < this.game.width - 2) ? 1 : 0;
        const topFree:number = (headPos.y > 1) ? 1 : 0;
        const bottomFree:number = (headPos.y < this.game.height - 2) ? 1 : 0;
        const distFoodHorizontal:number = foodPos.x - headPos.x;
        const distFoodVertical:number = foodPos.y - headPos.y;

        switch(this.direction) {
            case Direction.Up:
                input = [leftFree, topFree, rightFree];
                if(Alias.configService.snakeEats){
                    input.push (distFoodHorizontal, distFoodVertical);
                }else{
                    input.push (0, 0);                    
                }
                break;

            case Direction.Left:
                input = [bottomFree, leftFree, topFree];                    
                if(Alias.configService.snakeEats){
                    input.push (-distFoodVertical, distFoodHorizontal);
                }else{
                    input.push (0, 0);                    
                }

                break;

            case Direction.Down:
                input = [rightFree, bottomFree, leftFree];                    
                if(Alias.configService.snakeEats){
                    input.push (-distFoodHorizontal, -distFoodVertical);
                }else{
                    input.push (0, 0);                    
                }
                break;

            case Direction.Right:
                input = [topFree, rightFree, bottomFree];                    
                if(Alias.configService.snakeEats){
                    input.push (distFoodVertical, -distFoodHorizontal);
                }else{
                    input.push (0, 0);                    
                }

                break;
        }

        /*
        console.log(' head ' + headPos.y + ' fv: ' + distFoodVertical + ' score: ' + this.brain.score 
                + ' dir: ' + this.direction + ' noFoodTicks: ' + this.noFoodTicks);
        */

        input.forEach(i => MathUtils.sigmoid(i));

        return input;
    }
}
