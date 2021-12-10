import { useState } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
const MyColorPicker = () => {
  // #aabbcc is set as the default color in the color picker
  // You can change it to any color by changing the hex value in the useState hook
  const [color, setColor] = useState('#aabbcc')
  return (
    <div>
      <HexColorPicker color={color} onChange={setColor} />
      <HexColorInput color={color} onChange={setColor} />
    </div>
  )
}
export default MyColorPicker