const board=document.querySelector('.board');
const blockheight=50;
const blockwidth=50;
let highScore = localStorage.getItem("highScore") || 0
let score=0
let time=`00-00`

const highScoreElemant = document.querySelector("#high-score");
highScoreElemant.innerText = highScore

//calculate width and height of the block,,,accroding to the board;
const cols=Math.floor(board.clientWidth/blockwidth);
const rows=Math.floor(board.clientHeight/blockheight);
const scoreElemant = document.querySelector("#score");
const timeElemant = document.querySelector("#time");
const startbutton=document.querySelector(".btn-start")
const modal=document.querySelector(".modal")
const startgamemodal=document.querySelector(".start-game") 
const gameovermodal=document.querySelector(".game-over") 
const restartButton=document.querySelector(".btn-restart")
let intervalId=null;
let timerintervalId=null;

//now for the random food ;
let food ={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}

//creating an array to store each block coordinates;
const blocks=[];

//create an array for snake coordinates;
let snake =[
    {
        x:1,y:3
    }
] 

//snake head postion initally;
let direction='down';
 
//loop for inserting elemant in the board
for(let row =0 ;row<rows  ;row++){
    for(let col=0;col<cols;col++){
        const block=document.createElement('div'); // create and elemant called block;
        block.classList.add("block");//assigned class name to it
        board.appendChild(block);// insert the block elemant to board;
        blocks[`${row}-${col}`]=block;
    }
}

//func for render snake on the board 
function render(){
    //logic of snake movement;
    let head=null

    //logic of food spawn;
    if(blocks[`${food.x}-${food.y}`]){
        blocks[`${food.x}-${food.y}`].classList.add("food")
    }

    //direction of snake in each position work to do;
    if(direction === "left"){
        head ={x:snake [0].x,y:snake[0].y-1}
    }else if(direction === "right"){
        head ={x:snake [0].x,y:snake[0].y+1}
    }else if (direction === "down"){
         head ={x:snake [0].x+1,y:snake[0].y}
    }else if (direction === "up"){
         head ={x:snake [0].x-1,y:snake[0].y}
    }

    //giving alert 
    if(head.x < 0 || head.x>=rows || head.y<0 || head.y>=cols){
        clearInterval(intervalId)
        clearInterval(timerintervalId)
        modal.style.display="flex"
        startgamemodal.style.display="none"
        gameovermodal.style.display="flex"
        return;
    } 

    //for remove the last segment of the snake 
    snake.forEach(segment =>{
        if (blocks[`${segment.x}-${segment.y}`]) {
            blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
        }
    })

    //if head of snake and food touches it becomes big and random spwan of food 
    if(head.x==food.x && head.y == food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food ={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
        snake.unshift(head)    
        score+=10
        scoreElemant.innerText=score
    }else{
        snake.unshift(head)
        snake.pop()
    }

    if(score>highScore){
        highScore=score
        highScoreElemant.innerText=highScore
        //local storage data store and read  in string format
        localStorage.setItem("highScore", highScore.toString())
    }

    //render snake
    snake.forEach(segment =>{
        if (blocks[`${segment.x}-${segment.y}`]) {
            blocks[`${segment.x}-${segment.y}`].classList.add("fill")
        }
    })
}

//listner for game start 
startbutton.addEventListener("click",() =>{
    modal.style.display="none"
    clearInterval(intervalId)
    clearInterval(timerintervalId)
    intervalId=setInterval(()=>{render()},100)
    timerintervalId=setInterval(()=>{
        let [min,sec]=time.split("-").map(Number)
        if(sec==59){
            min+=1
            sec=0
        }else{
            sec+=1
        }
        time=`${min}-${sec}`
        timeElemant.innerText=time
    },1000)
})

restartButton.addEventListener("click",restartGame)

//function for restartgame;
function restartGame(){
    clearInterval(intervalId)
    clearInterval(timerintervalId)
    blocks[`${food.x}-${food.y}`].classList.remove("food")

    snake.forEach(segment =>{
        if (blocks[`${segment.x}-${segment.y}`]) {
            blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
        }
    })

    score=0
    time=`00-00`
    scoreElemant.innerText=score
    timeElemant.innerText=time 
    highScoreElemant.innerText=highScore
    modal.style.display="none"
    direction="down"
    snake=[{x:1,y:3}]
    food ={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
    intervalId=setInterval(()=>{render()},100)
    timerintervalId=setInterval(()=>{
    let [min,sec]=time.split("-").map(Number)
    if(sec==59){
        min+=1
        sec=0
    }else{
        sec+=1
    }
    time=`${min}-${sec}`
    timeElemant.innerText=time
    },1000)
}

//adding eventlistner if key is pressed ;
addEventListener("keydown",(event)=>{
    if (event.key=="ArrowUp" && direction!=="down"){
        direction="up"
    }else if (event.key=="ArrowRight" && direction!=="left"){
        direction="right"
    }else if(event.key=="ArrowLeft" && direction!=="right"){
        direction="left"
    }else if(event.key=="ArrowDown" && direction!=="up"){
        direction="down"
    }
})