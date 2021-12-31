import { useState } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import styles from '../styles/Home.module.css'


function sendAnimation(newColor, newAnimation, newRainbowCyle=false, newRandomColor=false) {
  console.log(`new color: ${newColor}`)
  console.log(`new animation: ${newAnimation}`)
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
                            color: newColor,
                            animation: newAnimation,
                            rainbowCycle: newRainbowCyle,
                            randomColor: newRandomColor})
  };
  fetch(`http://192.168.1.14:5000/animation`, requestOptions)
  .then(response=>{
    console.log(response.ok);
    response.text();
  })
  .catch(
      console.log("this is okay")
  );
}


const MyColorPicker = () => {
  // #aabbcc is set as the default color in the color picker
  // You can change it to any color by changing the hex value in the useState hook
  const [color, setColor] = useState('#aabbcc')
  return (
    <div>
      <HexColorPicker color={color} onChange={setColor} />
      <HexColorInput color={color} onChange={setColor} />
      <button onClick={ () => sendAnimation(color, 'new_color')}>New Color</button>
      <div className={styles.container}>
        <div className={styles.container}>
          <h1>Regular</h1>
          <button onClick={ () => sendAnimation(color, 'fill')}>Fill</button>
          <button onClick={ () => sendAnimation(color, 'column_bounce')}>Column Bounce</button>
          <button onClick={ () => sendAnimation(color, 'row_bounce')}>Row Bounce</button>
          <button onClick={ () => sendAnimation(color, 'comet')}>Comet</button>
          <button onClick={ () => sendAnimation(color, 'rainbow_cycle')}>Rainbow Cycle</button>
          <button onClick={ () => sendAnimation(color, 'sparkle')}>Sparkle</button>
          <button onClick={ () => sendAnimation(color, 'rain')}>Rain</button>
        </div>
        <div className={styles.container}>
          <h1>Color Slides</h1>
          <button onClick={ () => sendAnimation(color, 'fill')}>Fill</button>
          <button onClick={ () => sendAnimation(color, 'column_bounce')}>Column Bounce</button>
          <button onClick={ () => sendAnimation(color, 'row_bounce')}>Row Bounce</button>
          <button onClick={ () => sendAnimation(color, 'comet')}>Comet</button>
          <button onClick={ () => sendAnimation(color, 'sparkle')}>Sparkle</button>
          <button onClick={ () => sendAnimation(color, 'rain')}>Rain</button>
        </div>
        <div className={styles.container}>
          <h1>Rainbow Cylces</h1>
          <button onClick={ () => sendAnimation(color, 'column_bounce_rainbow')}>Column Bounce Rainbow</button>
          <button onClick={ () => sendAnimation(color, 'row_bounce_rainbow', true)}>Row Bounce Rainbow</button>
          <button onClick={ () => sendAnimation(color, 'comet_rainbow', true)}>Comet Rainbow</button>
          <button onClick={ () => sendAnimation(color, 'sparkle_rainbow', true)}>Sparkle Rainbow</button>
          <button onClick={ () => sendAnimation(color, 'rain_rainbow', true)}>Rain Rainbow</button>
        </div>
        <div className={styles.container}>
          <h1>Random Color</h1>
          <button onClick={ () => sendAnimation(color, 'fill', newRandomColor=true)}>Fill</button>
          <button onClick={ () => sendAnimation(color, 'column_bounce', newRandomColor=true)}>Column Bounce</button>
          <button onClick={ () => sendAnimation(color, 'row_bounce', newRandomColor=true)}>Row Bounce</button>
          <button onClick={ () => sendAnimation(color, 'comet', newRandomColor=true)}>Comet</button>
          <button onClick={ () => sendAnimation(color, 'sparkle', newRandomColor=true)}>Sparkle</button>
          <button onClick={ () => sendAnimation(color, 'rain', newRandomColor=true)}>Rain</button>
        </div>
      </div>
    </div>
  )
}
export default MyColorPicker