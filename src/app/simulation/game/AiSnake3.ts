import { MathUtils } from './../utils/MathUtils';
import { Alias } from './../Alias';
import { Direction } from './../model/Direction.enum';
import { XY } from './../model/XY';
import { Snake } from './Snake';
import { Network } from 'neataptic';
import { getHottestIndex } from './../utils/Utils';

export class AiSnake3 extends Snake {

    constructor (public brain:Network){
        
        super ();
        this.brain.score = 0;
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
            this.brain.score /= 2;
            this.isDead = true;
            this.game.snakeDead ();                
        }else{
            this.brain.score += score;
        }

    }

    private setDirection (hottestIdx:Direction){
        switch(this.direction){ 
            case Direction.Up:
                if(hottestIdx != Direction.Down){
                    this.direction = hottestIdx;
                }
                break;

            case Direction.Down:
                if(hottestIdx != Direction.Up){
                    this.direction = hottestIdx;
                }
                break;

            case Direction.Left:
                if(hottestIdx != Direction.Right){
                    this.direction = hottestIdx;
                }
                break;

            case Direction.Right:
                if(hottestIdx != Direction.Left){
                    this.direction = hottestIdx;
                }
                break;
        }    
    }


    private calcScore (input:number[], hottestIdx:number):number {
        const distFoodHorizontal = input[4];
        const distFoodVertical = input[5];
        let score:number = 1;
        
        if(!Alias.configService.snakeEats){
            return score;
        }


        if(distFoodHorizontal < 0){
            if(this.direction == Direction.Left){
                score ++;
            }else if(this.direction == Direction.Right){
                score --;
            }
        }else if(distFoodHorizontal > 0){
            if(this.direction == Direction.Left){
                score --;
            }else if(this.direction == Direction.Right){
                score ++;
            }
        }else{
            if(this.direction == Direction.Left || this.direction == Direction.Right){
                score --;
            }else{
                score ++;
            }
        }
        
        if(distFoodVertical < 0){
            if(this.direction == Direction.Up){
                score ++;
            }else if(this.direction == Direction.Down){
                score --;
            }
        }else if(distFoodVertical > 0){
            if(this.direction == Direction.Up){
                score --;
            }else if(this.direction == Direction.Down){
                score ++;
            }
        }else{
            if(this.direction == Direction.Up || this.direction == Direction.Down){
                score --;
            }else{
                score ++;
            }
        }

        if(this.hasEaten){
            score += 10;
        }

        return score;

    }


    private calcInput ():number[] {
        const headPos:XY = this.bodyParts[0];
        const foodPos:XY = this.game.foodPos;
        let input:number[];

        const distHeadBorderLeft:number = -headPos.x;
        const distHeadBorderRight:number = this.game.width - headPos.x - 1;
        const distHeadBorderTop:number = -headPos.y;
        const distHeadBorderBottom:number = this.game.height - headPos.y - 1;
        const distFoodHorizontal:number = foodPos.x - headPos.x;
        const distFoodVertical:number = foodPos.y - headPos.y;

        switch(this.direction) {
            case Direction.Up:
                input = [distHeadBorderLeft, distHeadBorderTop, distHeadBorderRight];
                if(Alias.configService.snakeEats){
                    input.push (distFoodHorizontal, distFoodVertical);
                }else{
                    input.push (0, 0);                    
                }
                break;

            case Direction.Left:
                input = [-distHeadBorderBottom, distHeadBorderLeft, -distHeadBorderTop];                    
                if(Alias.configService.snakeEats){
                    input.push (-distFoodVertical, distFoodHorizontal);
                }else{
                    input.push (0, 0);                    
                }

                break;

            case Direction.Down:
                input = [-distHeadBorderRight, -distHeadBorderBottom, -distHeadBorderLeft];                    
                if(Alias.configService.snakeEats){
                    input.push (-distFoodHorizontal, -distFoodVertical);
                }else{
                    input.push (0, 0);                    
                }
                break;

            case Direction.Right:
                input = [distHeadBorderTop, -distHeadBorderRight, distHeadBorderBottom];                    
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
