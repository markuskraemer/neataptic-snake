export function getHottestIndex (a:number[]):number {
    let max = Number.MIN_SAFE_INTEGER;  
    let hotindex = -1;
    a.forEach ((i, j) => {
        if(i > max){
            max = i;
            hotindex = j;
        }
    });
    return hotindex;
}
