

let light = $('.light');
let colorIndex = 1;
let direction='right'

function updateLights(){
    light.css({backgroundColor:'white'});
    light[colorIndex].style.background='red'
    if (colorIndex>0){
        light[colorIndex-1].style.background='pink'
    }
    if (colorIndex<10){
        light[colorIndex+1].style.background='pink'
    }
    if (colorIndex===10){
        direction='left'
    }
    if (colorIndex===0){
        direction='right'
    }
    if (direction==='right'){
        colorIndex++;
    }else{
        colorIndex--;
    }
}

let interval=null;
$('#btn-start').click((e)=>{
    $('#audio')[0].play();
    interval = setInterval(updateLights,10);
})
$('#btn-stop').click((e)=>{
    $('#audio')[0].pause();
    clearInterval(interval)
})