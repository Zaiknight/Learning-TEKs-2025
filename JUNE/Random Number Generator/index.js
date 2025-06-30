function getMinMax() {
    let min, max;

    let minInput = document.getElementById('min');
    let maxInput = document.getElementById('max');

    min = minInput.value;
    max = maxInput.value;

    if(min == 0 && max == 0){
        min = 0;
        max = 32768;
        rand(min,max);
    }
    else if(max == 0){
        max = 32768;
        rand(min,max);
    }
    else{
        rand(min,max);
    }

}

function rand(min,max){
    let rand = Number(Math.floor(Math.random()*(max-min)) + Number(min));
    document.getElementById("randomNum").innerText = rand;
}

