import { useState } from 'react'


function ColorPicker(){
    const [color,setColor] = useState("#FFFFFF");

    function handleColorChange(e){
        setColor(event.target.value);
    }

    return(
    <body className='container' style={{backgroundColor: color, margin:'0', overflow: 'hidden'}}>
        <div className='colorPickerContainer' style={{backgroundColor: "#111111"}}>
            <h1>Color Picker</h1>
            <div className='colorDisplay' style={{backgroundColor: color,
                                                borderRadius: '30px',
                                                textAlign: 'center',
                                
            }}>
            <p>Selected Color: {color}</p>
            </div >
            <div style={{textAlign : 'center'}}>
                <label>Select a Color: </label>
                <input type = "color" value={color} onChange={handleColorChange}/>
            </div>
        </div>
    </body>
    );
}

export default ColorPicker