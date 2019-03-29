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
        }else if(this.bodyParts.length > (this.game.width * this.game.height) / 3){
            console.log('tooo long: ' + this.bodyParts.length);
            this.isDead = true;
            this.game.snakeDead (); 
        }else{
            this.brain.score += score;
        }
        /*
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        this.calcInput ();
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        */

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

    private isLeftFree () {
        const headPos:XY = this.bodyParts[0];
        return (headPos.x > 0);        
    }

    private isTopFree () {
        const headPos:XY = this.bodyParts[0];
        return (headPos.y > 0);        
    }

    private isRightFree () {
        const headPos:XY = this.bodyParts[0];
        return (headPos.x < this.game.width - 2);        
    }

    private isBottomFree () {
        const headPos:XY = this.bodyParts[0];
        return (headPos.y < this.game.height - 2);        
    }


    private calcInput ():number[] {
        const headPos:XY = this.bodyParts[0];
        const foodPos:XY = this.game.foodPos;
        let input:number[];

        const distFoodHorizontal:number = foodPos.x - headPos.x;
        const distFoodVertical:number = foodPos.y - headPos.y;

        let leftFree    = this.isLeftFree ();
        let rightFree   = this.isRightFree ();
        let topFree     = this.isTopFree ();
        let bottomFree  = this.isBottomFree ();

        if(Alias.configService.snakeDiesOnHittingItself){
            const leftInBody = this.snakeBodyContainsPos ({x: headPos.x - 1, y: headPos.y});
            const topInBody = this.snakeBodyContainsPos ({x: headPos.x, y: headPos.y - 1});
            const rightInBody = this.snakeBodyContainsPos ({x: headPos.x + 1, y: headPos.y});
            const bottomInBody = this.snakeBodyContainsPos ({x: headPos.x, y: headPos.y - 1});
        
            leftFree = leftFree && !leftInBody;
            topFree = topFree && !topInBody;
            rightFree = rightFree && !rightInBody;
            bottomFree = bottomFree && !bottomInBody;
        }

        const leftFreeNum = Number (leftFree);
        const topFreeNum = Number (topFree);
        const rightFreeNum = Number (rightFree);
        const bottomFreeNum = Number (rightFree);


        switch(this.direction) {
            case Direction.Up:
                input = [leftFreeNum, topFreeNum, rightFreeNum];
                if(Alias.configService.snakeEats){
                    input.push (distFoodHorizontal, distFoodVertical);
                }else{
                    input.push (0, 0);                    
                }
                break;

            case Direction.Left:
                input = [bottomFreeNum, leftFreeNum, topFreeNum];                    
                if(Alias.configService.snakeEats){
                    input.push (-distFoodVertical, distFoodHorizontal);
                }else{
                    input.push (0, 0);                    
                }

                break;

            case Direction.Down:
                input = [rightFreeNum, bottomFreeNum, leftFreeNum];                    
                if(Alias.configService.snakeEats){
                    input.push (-distFoodHorizontal, -distFoodVertical);
                }else{
                    input.push (0, 0);                    
                }
                break;

            case Direction.Right:
                input = [topFreeNum, rightFreeNum, bottomFreeNum];                    
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

        input = input.map(i => MathUtils.sigmoid(i));
        return input;
    }
}
