let counter = 0;
counter = Number(counter)

document.getElementById("nxt").onclick = function(){
    counter = counter + 1;
    document.getElementById("myCount").innerText = counter;
}
document.getElementById("bck").onclick = function(){
    if(counter == 0){
        counter = 0;
    }
    else{
    counter = counter - 1;
    document.getElementById("myCount").innerText = counter;
    }
}
document.getElementById("rst").onclick = function(){
    counter =0;
    document.getElementById("myCount").innerText = counter;
}