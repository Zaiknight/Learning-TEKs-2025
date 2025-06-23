function getMinMax() {
    let min = 0, max = 32768;

    let minInput = document.getElementById('min');
    let maxInput = document.getElementById('max');

    min = minInput.value;
    max = maxInput.value;

    rand(min,max);
}

function rand(min,max){
    let rand = Number(Math.floor(Math.random()*max) + Number(min));
    document.getElementById("randomNum").innerText = rand;
}

