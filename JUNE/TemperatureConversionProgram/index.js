let inputTemp,outputTemp,selInput,selOutput,inUnitValue,outUnitValue;

function convert() {
    let Temp=document.getElementById('inputTemp');
    inputTemp = Temp.value;
    console.log(inputTemp);
    
    inUnitValue = document.getElementById("inUnit");
    selInput = inUnitValue.value;

    outUnitValue = document.getElementById('outUnit');
    selOutput = outUnitValue.value;

    console.log(selInput);
    console.log(selOutput);

    if(selInput == 'Celsius' && selOutput == 'Fahrenheit'){
        outputTemp = (Number(inputTemp)*(9/5))+32;
    }
    else if(selInput == 'Celsius' && selOutput == 'Kelvin'){
        outputTemp = (Number(inputTemp)) + 273.15;
    }
    else if(selInput == 'Celsius' && selOutput == 'Celsius'){
        outputTemp = (Number(inputTemp));
    }
    else if(selInput == 'Fahrenheit' && selOutput == 'Kelvin'){
        outputTemp = (Number(inputTemp) + 459.67) * (5/9);
    }
    else if(selInput == 'Fahrenheit' && selOutput == 'Celsius'){
        outputTemp = (Number(inputTemp -32)) * (5/9);
    }
    else if(selInput == 'Fahrenheit' && selOutput == 'Fahrenheit'){
        outputTemp = (inputTemp);
    }
    else if(selInput == 'Kelvin' && selOutput == 'Celsius'){
        outputTemp = Number(inputTemp) - 273.15;
    }
    else if(selInput == 'Kelvin' && selOutput == 'Fahrenheit'){
        outputTemp = (Number((inputTemp)) * (5/9)) - 459.67;
    }
    else if(selInput == 'Kelvin' && selOutput == 'Kelvin'){
        outputTemp = inputTemp;
    }
    document.getElementById("outputTemp").innerText = outputTemp;
}
