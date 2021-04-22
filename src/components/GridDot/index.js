import { ThemeProvider } from 'styled-components'

import { 
  Dot, 
  DotContent, 
  DotInput, 
  ClockHand12, ClockHand1, ClockHand3, ClockHand4, ClockHand6, ClockHand7, ClockHand9, ClockHand10 } from './styles'


export default () => {
  /**
   * СФОРМИРОВАТЬ МАССИВ ДОСТУПНЫХ ЯЧЕЕК В ЗАВИСИМОСТИ ОТ АКТИВНОЙ ЯЧЕЙКИ actDot
   */
  const collectActCub = actDot => {
    const actSymbol = actDot[0]
    const actNumStr = actDot.slice(1)
    
    const actNum = +actNumStr
    const actSymbolCode = actSymbol.codePointAt(0)

    let leftCol = null
    let rightCol = null

    if (actSymbolCode !== 1040) leftCol = String.fromCodePoint(actSymbolCode - 1)
    if (actSymbolCode !== 1068) rightCol = String.fromCodePoint(actSymbolCode + 1)

    let actCub = []

    actCub[0] = leftCol && actNum > 0 ? leftCol + (actNum - 1) : null
    actCub[1] = actNum > 0 ? actSymbol + (actNum - 1) : null
    actCub[2] = rightCol && actNum > 0 ? rightCol + (actNum - 1) : null
    actCub[3] = leftCol ? leftCol + actNum : null
    actCub[4] = actDot
    actCub[5] = rightCol ? rightCol + actNum : null
    actCub[6] = leftCol && actNum < 36 ? leftCol + (actNum + 1) : null
    actCub[7] = actNum < 36 ? actSymbol + (actNum + 1) : null
    actCub[8] = rightCol && actNum < 36 ? rightCol + (actNum + 1) : null

    return actCub
  }

  /**
   * ОБРАБОТЧИК СОБЫТИЯ НАЖАТИЯ НА ЯЧЕЙКУ
   */
  const handleChange = ev => {
    const { value } = ev.target

    console.log(`[dot]: ${value}`)
    
    const actCub = collectActCub(value)
    console.log(`[actCub]:`, actCub)
  }

  /**
   * ОТОБРАЖЕНИЕ СЕТКИ
   */
  const renderGrid = () => {
    let grid = []

    for(let x = 0; x < 37; x++) {
      for(let i = 1040; i < 1069; i++) {
        const symbol = String.fromCharCode(i) 
        const code = symbol + x
        grid.push(
          <Dot key={`${x}-${i}`} >
            <div>
              {/* <label htmlFor={`${code}`}>{code}</label> */}
              <ClockHand12 id={`${code}-12`} visible />
              <ClockHand1 id={`${code}-1`} visible />
              <ClockHand3 id={`${code}-3`} visible />
              <ClockHand4 id={`${code}-4`} visible />
              <ClockHand6 id={`${code}-6`} visible />
              <ClockHand7 id={`${code}-7`} visible />
              <ClockHand9 id={`${code}-9`} visible />
              <ClockHand10 id={`${code}-10`} visible />
              <DotInput type='checkbox' id={`${code}`} name={`${code}`} value={`${code}`} onChange={handleChange} />
            </div>
          </Dot>
        )
      }
    }
    const theme = { size: '50px' }

    return (
      <ThemeProvider theme={theme}>
        <DotContent>
          {grid}
        </DotContent>
      </ThemeProvider>
    )
  }


  return (
    <>
      {renderGrid()}
    </>
  )
}