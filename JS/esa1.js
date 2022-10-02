const spiteSheet = document.getElementById("spiteSheet");
const form = document.getElementById("anim");
const width = 4000;
const height = 3000;
const rows = 3;
const columns = 4;

let currentPosition = [0, 0]
var interval;
var auto = false;

const columnWidth = width/columns;
const rowHeight = height/rows;

spiteSheet.style.width = columnWidth;
spiteSheet.style.height = rowHeight;

function movePosition(direction){
    if (direction){
        currentPosition[0] = currentPosition[0] +1;
        if (currentPosition[0] >= columns){
            currentPosition[0] = 0;
            currentPosition[1] = currentPosition[1] +1
            if (currentPosition[1] >= rows){
                currentPosition[1] = 0;
            }

        }
    }
    else {
        currentPosition[0] = currentPosition[0] -1;
        if (currentPosition[0] < 0){
            currentPosition[0] = columns -1;
            currentPosition[1] = currentPosition[1] -1
            if (currentPosition[1] < 0){
                currentPosition[1] = rows -1;
            }

        }
    }
    showPosition();
}

function showPosition(){
    let x = currentPosition[0] * columnWidth;
    let y = currentPosition[1] * rowHeight;
    spiteSheet.style.backgroundPosition =  `-${x}px -${y}px`

}

function keyevent(event){
    
    if (event.key == "a"){
        if(auto == true){
            clearInterval(interval);
            auto = false;
            
        }
        else{
            clearInterval(interval);
            interval = setInterval(movePosition, 100, true);
            auto = true;
        }
        }

    
    if (event.key == "r"){
        movePosition(true);   
    }
    if (event.key == "l"){
        movePosition(false);
    }
}


function changeAnimation(e){
    spiteSheet.style.backgroundImage = `url(../ESA1/${e.target.value}.png)`;
    currentPosition = [0, 0];
}

document.addEventListener('keydown', keyevent)
anim.addEventListener('change', changeAnimation)

showPosition();

