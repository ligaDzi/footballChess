import { Stage } from 'react-konva'

import LogicLayer from '../LogicLayer'

import './styles.css'


export default ({ width, height }) => {

  return (
    <Stage className='footballField' width={width} height={height}>
      <LogicLayer width={width} height={height} /> 
    </Stage>
  )
}