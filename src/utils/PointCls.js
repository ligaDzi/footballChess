import { intersect } from 'mathjs'
import { halfEnum } from './helpers'

export class PointCls {
  #x = null
  #y = null
  #name = null
  #checked = false
  #disabled = false
  #color = null

  constructor(x, y, name) {
    this.#x = x
    this.#y = y
    this.#name = name
    this.#checked = false
    this.#disabled = false
    this.#color = 'yellow'
  }

  get x() { return this.#x }
  get y() { return this.#y }

  get name() { return this.#name }
  get nameSymbol() { return this.#name[0] }
  get nameNumber() { return this.#name.slice(1) }
  
  get checked() { return this.#checked }
  set checked(value) { this.#checked = !!value }

  get disabled() { return this.#disabled }
  set disabled(value) { this.#disabled = !!value }

  get color() { return this.#color }
  set color(value) { this.#color = value }

  /**
   * ТЕСТОВЫЙ МЕТОД 
   */
  _getActCub() {
    const actNum = +this.nameNumber
    const actSymbolCode = this.nameSymbol.codePointAt(0)

    let leftCol = null
    let rightCol = null

    if (actSymbolCode !== 1040) leftCol = String.fromCodePoint(actSymbolCode - 1)
    if (actSymbolCode !== 1068) rightCol = String.fromCodePoint(actSymbolCode + 1)

    let actCub = []

    actCub[0] = leftCol && actNum > 0 ? leftCol + (actNum - 1) : null
    actCub[1] = actNum > 0 ? this.nameSymbol + (actNum - 1) : null
    actCub[2] = rightCol && actNum > 0 ? rightCol + (actNum - 1) : null
    actCub[3] = leftCol ? leftCol + actNum : null
    actCub[4] = this.#name
    actCub[5] = rightCol ? rightCol + actNum : null
    actCub[6] = leftCol && actNum < 36 ? leftCol + (actNum + 1) : null
    actCub[7] = actNum < 36 ? this.nameSymbol + (actNum + 1) : null
    actCub[8] = rightCol && actNum < 36 ? rightCol + (actNum + 1) : null

    return actCub
  }

  getNameArroundPoints() {
    const actNum = +this.nameNumber
    const actSymbolCode = this.nameSymbol.codePointAt(0)

    let leftCol = null
    let rightCol = null

    if (actSymbolCode !== 1040) leftCol = String.fromCodePoint(actSymbolCode - 1)
    if (actSymbolCode !== 1068) rightCol = String.fromCodePoint(actSymbolCode + 1)

    let arroundPoints = []

    if (leftCol && actNum > 0) arroundPoints.push(leftCol + (actNum - 1))
    if (actNum > 0) arroundPoints.push(this.nameSymbol + (actNum - 1))
    if (rightCol && actNum > 0) arroundPoints.push(rightCol + (actNum - 1))
    if (leftCol) arroundPoints.push(leftCol + actNum)
    if (rightCol) arroundPoints.push(rightCol + actNum)
    if (leftCol && actNum < 36) arroundPoints.push(leftCol + (actNum + 1))
    if (actNum < 36) arroundPoints.push(this.nameSymbol + (actNum + 1))
    if (rightCol && actNum < 36) arroundPoints.push(rightCol + (actNum + 1))

    return arroundPoints
  }

  getNameKickPoints() {
    const actNum = +this.nameNumber
    const actSymbolCode = this.nameSymbol.codePointAt(0)
    const actPointCoords = [actSymbolCode, actNum]

    const kickLength = 11
    const axisX = { min: 1040, max: 1068 }
    const axisY = { min: 0, max: 36 }
    let kickPoints = []

    // TOP-LEFT KICK POINT
    if (actSymbolCode !== axisX.min && actNum !== axisY.min) {
      const leftTopKickPoint = [actSymbolCode - kickLength, actNum - kickLength]

      const nameLTKick = this.__findeLeftTopKickPoint(leftTopKickPoint, axisX, axisY, actPointCoords)

      kickPoints.push(nameLTKick)
    }
    // ------------------------------------------
    // TOP KICK POINT
    if (actNum !== axisY.min) {
      const topKickPoint = [actSymbolCode, actNum - kickLength]

      const nameTKick = this.__findTopKickPoint(topKickPoint, axisX, axisY, actPointCoords)
      kickPoints.push(nameTKick)
    }
    // ------------------------------------------
    // RIGHT TOP KICK POINT
    if (actSymbolCode !== axisX.max && actNum !== axisY.min) {
      const rightTopKickPoint = [actSymbolCode + kickLength, actNum - kickLength]

      const nameKick = this.__findRightTopKickPoint(rightTopKickPoint, axisX, axisY, actPointCoords)
      kickPoints.push(nameKick)
    }
    // ------------------------------------------
    // RIGHT KICK POINT
    if (actSymbolCode !== axisX.max) {
      const rightKickPoint = [actSymbolCode + kickLength, actNum]

      const nameKick = this.__findRightKickPoint(rightKickPoint, axisX, axisY, actPointCoords)
      kickPoints.push(nameKick)
    }
    // ------------------------------------------
    // RIGHT BOTTOM KICK POINT
    if (actSymbolCode !== axisX.max && actNum !== axisY.max) {
      const rightBottomKickPoint = [actSymbolCode + kickLength, actNum + kickLength]

      const nameKick = this.__findRightBottomKickPoint(rightBottomKickPoint, axisX, axisY, actPointCoords)
      kickPoints.push(nameKick)
    }
    // ------------------------------------------
    // BOTTOM KICK POINT
    if (actNum !== axisY.max) {
      const bottomKickPoint = [actSymbolCode, actNum + kickLength]

      const nameKick = this.__findBottomKickPoint(bottomKickPoint, axisX, axisY, actPointCoords)
      kickPoints.push(nameKick)
    }
    // ------------------------------------------
    // LEFT BOTTOM KICK POINT
    if (actSymbolCode !== axisX.min && actNum !== axisY.max) {
      const leftBottomKickPoint = [actSymbolCode - kickLength, actNum + kickLength]

      const nameKick = this.__findLeftBottomKickPoint(leftBottomKickPoint, axisX, axisY, actPointCoords)
      kickPoints.push(nameKick)
    }
    // ------------------------------------------
    // LEFT KICK POINT
    if (actSymbolCode !== axisX.min) {
      const leftKickPoint = [actSymbolCode - kickLength, actNum]
      
      const nameKick = this.__findLeftKickPoint(leftKickPoint, axisX, axisY, actPointCoords)
      kickPoints.push(nameKick)
    }
    // ------------------------------------------

    return kickPoints
  }

  __findeLeftTopKickPoint(pointCoords, axisX, axisY, actPointCoords) {
    let kickName = null  

    kickName = this.__pointWithinField(pointCoords, axisX, axisY)
    if (kickName) return kickName
    
    kickName = this.__pointWithinTopLineField(pointCoords, actPointCoords)
    if (kickName) return kickName
        
    kickName = this.__pointWithinLeftLineField(pointCoords, actPointCoords)
    if (kickName) return kickName
  }

  __findTopKickPoint(pointCoords, axisX, axisY, actPointCoords) {
    let kickName = null  
    
    kickName = this.__pointWithinField(pointCoords, axisX, axisY)
    if (kickName) return kickName

    kickName = this.__pointWithinTopLineField(pointCoords, actPointCoords)
    if (kickName) return kickName
  }

  __findRightTopKickPoint(pointCoords, axisX, axisY, actPointCoords) {
    let kickName = null  

    kickName = this.__pointWithinField(pointCoords, axisX, axisY)
    if (kickName) return kickName

    kickName = this.__pointWithinTopLineField(pointCoords, actPointCoords)
    if (kickName) return kickName

    kickName = this.__pointWithinRightLineField(pointCoords, actPointCoords)
    if (kickName) return kickName
  }

  __findRightKickPoint(pointCoords, axisX, axisY, actPointCoords) {
    let kickName = null  

    kickName = this.__pointWithinField(pointCoords, axisX, axisY)
    if (kickName) return kickName
    
    kickName = this.__pointWithinRightLineField(pointCoords, actPointCoords)
    if (kickName) return kickName
  }

  __findRightBottomKickPoint(pointCoords, axisX, axisY, actPointCoords) {
    let kickName = null  

    kickName = this.__pointWithinField(pointCoords, axisX, axisY)
    if (kickName) return kickName
    
    kickName = this.__pointWithinRightLineField(pointCoords, actPointCoords)
    if (kickName) return kickName
    
    kickName = this.__pointWithinBottomLineField(pointCoords, actPointCoords)
    if (kickName) return kickName
  }

  __findBottomKickPoint(pointCoords, axisX, axisY, actPointCoords) {
    let kickName = null  

    kickName = this.__pointWithinField(pointCoords, axisX, axisY)
    if (kickName) return kickName
        
    kickName = this.__pointWithinBottomLineField(pointCoords, actPointCoords)
    if (kickName) return kickName
  }

  __findLeftBottomKickPoint(pointCoords, axisX, axisY, actPointCoords) {
    let kickName = null  

    kickName = this.__pointWithinField(pointCoords, axisX, axisY)
    if (kickName) return kickName
            
    kickName = this.__pointWithinBottomLineField(pointCoords, actPointCoords)
    if (kickName) return kickName
        
    kickName = this.__pointWithinLeftLineField(pointCoords, actPointCoords)
    if (kickName) return kickName
  }

  __findLeftKickPoint(pointCoords, axisX, axisY, actPointCoords) {
    let kickName = null  

    kickName = this.__pointWithinField(pointCoords, axisX, axisY)
    if (kickName) return kickName
            
    kickName = this.__pointWithinLeftLineField(pointCoords, actPointCoords)
    if (kickName) return kickName
  }


  // ТОЧКА В ПРЕДЕЛАХ ПОЛЯ
  __pointWithinField(pointCoords, axisX, axisY) {
    if (pointCoords[0] < axisX.min) return null
    if (pointCoords[0] > axisX.max) return null
    if (pointCoords[1] < axisY.min) return null
    if (pointCoords[1] > axisY.max) return null
    return this.__composeKickName(pointCoords[0], pointCoords[1])
  }

  // ТОЧКА ЗА ЛЕВОЙ ЛИНИЕЙ ПОЛЯ
  __pointWithinLeftLineField(pointCoords, actPointCoords) {
    const leftLineField = { first: [1040, 0], last: [1040, 36] }

    const intersectLeftLine = intersect(pointCoords, actPointCoords, leftLineField.first, leftLineField.last)

    if (this.__isLiesOnVertLineField(intersectLeftLine, leftLineField)) {
      return this.__composeKickName(intersectLeftLine[0], intersectLeftLine[1])
    }
    return null
  }

  // ТОЧКА ЗА ВЕРХНЕЙ ЛИНИЕЙ ПОЛЯ
  __pointWithinTopLineField(pointCoords, actPointCoords) {
    const topLineField = { first: [1040, 0], last: [1068, 0] }

    const intersectTopLine = intersect(pointCoords, actPointCoords, topLineField.first, topLineField.last)

    if (this.__isLiesOnGorizontLineField(intersectTopLine, topLineField)) {
      return this.__composeKickName(intersectTopLine[0], intersectTopLine[1])
    }
    return null
  }

  // ТОЧКА ЗА ПРАВОЙ ЛИНИЕЙ ПОЛЯ
  __pointWithinRightLineField(pointCoords, actPointCoords) {
    const rightLineField = { first: [1068, 0], last: [1068, 36] }

    const intersectRightLine = intersect(pointCoords, actPointCoords, rightLineField.first, rightLineField.last)
    
    if (this.__isLiesOnVertLineField(intersectRightLine, rightLineField)) {
      return this.__composeKickName(intersectRightLine[0], intersectRightLine[1])
    }
    return null
  }

  // ТОЧКА ЗА НИЖНЕЙ ЛИНИЕЙ ПОЛЯ
  __pointWithinBottomLineField(pointCoords, actPointCoords) {
    const bottomLineField = { first: [1040, 36], last: [1068, 36] }

    const intersectBottomLine = intersect(pointCoords, actPointCoords, bottomLineField.first, bottomLineField.last)

    if (this.__isLiesOnGorizontLineField(intersectBottomLine, bottomLineField)) {
      return this.__composeKickName(intersectBottomLine[0], intersectBottomLine[1])
    }
    return null
  }



  __composeKickName(symbolCode, number) {
    return String.fromCodePoint(symbolCode) + number
  }

  __isLiesOnGorizontLineField(point, lineField) {
    if (
      (point[0] >= lineField.first[0] && point[0] <= lineField.last[0]) && 
      (point[1] === lineField.first[1])
    ) return true

    return false
  }

  __isLiesOnVertLineField(point, lineField) {
    if (
      (point[0] === lineField.first[0]) && 
      (point[1] >= lineField.first[1] && point[1] <= lineField.last[1])
    ) return true

    return false
  }
 
  static _choiceClassPoint(x, y, code) {
    const goalPostArr = ['К1', 'Т1', 'К35', 'Т35']
    const portalHTArr = ['К36', 'Л36', 'М36', 'Н36', 'О36', 'П36', 'Р36', 'С36', 'Т36']
    const portalGTArr = ['К0', 'Л0', 'М0', 'Н0', 'О0', 'П0', 'Р0', 'С0', 'Т0']
    const startPointAllArr = ['К18', 'Т18']
    const startPointHTArr = ['К17', 'К16', 'К15', 'Л15', 'М15', 'Н15', 'О15', 'П15', 'Р15', 'С15', 'Т17', 'Т16', 'Т15']
    const startPointGTArr = ['К19', 'К20', 'К21', 'Л21', 'М21', 'Н21', 'О21', 'П21', 'Р21', 'С21', 'Т19', 'Т20', 'Т21']
    const centralDiscrictArr = [
      'Л16', 'М16', 'Н16', 'О16', 'П16', 'Р16', 'С16', 'Л17', 'М17', 'Н17', 'О17', 'П17', 'Р17', 'С17', 'Л18', 'М18', 'Н18', 'О18', 'П18', 'Р18', 'С18', 'Л19', 'М19', 'Н19', 'О19', 'П19', 'Р19', 'С19', 'Л20', 'М20', 'Н20', 'О20', 'П20', 'Р20', 'С20'
    ]

    switch (true) {
      // ШТАНГА ДОМАШНЕЙ И ГОСТЕВОЙ КОМАНДЫ
      case goalPostArr.includes(code): return new GoalPostCls(x, y, code)

      // ВОРОТА ДОМАШНЕЙ КОМАНДЫ 
      case portalHTArr.includes(code): return new PortalPointCls(halfEnum.HOME, x, y, code)
        
      // // ВОРОТА ГОСТЕВОЙ 
      case portalGTArr.includes(code): return new PortalPointCls(halfEnum.GUEST, x, y, code)

      // // СТАРТОВАЯ ПОЗИЦИЯ ОБЩАЯ ДЛЯ КОМАНД
      case startPointAllArr.includes(code): return new StartPointCls(halfEnum.HOME_AND_GUEST, x, y, code)
      
      // // СТАРТОВАЯ ПОЗИЦИЯ ДОМАШНЕЙ КОМАНДЫ 
      case startPointHTArr.includes(code): return new StartPointCls(halfEnum.HOME, x, y, code)
      
      // // СТАРТОВАЯ ПОЗИЦИЯ ГОСТЕВОЙ КОМАНДЫ 
      case startPointGTArr.includes(code): return new StartPointCls(halfEnum.GUEST, x, y, code)

      // // ЦЕНТРАЛЬНЫЙ КРУГ
      case centralDiscrictArr.includes(code): return new CentralDistrictCls(x, y, code)
    
      default: return new PointCls(x, y, code)
    }
  }

  static createPointArr(widthCell, heightCell) {
    let grid = []
  
    for(let j = 0, y = 0; j < 37; j++) {    
      for(let i = 1040, x = 0; i < 1069; i++) {
        const symbol = String.fromCharCode(i) 
        const code = symbol + j
        grid.push(
          PointCls._choiceClassPoint(x, y, code)
        )
        x += heightCell
      }
      y += widthCell
    }
    return grid
  }
}



export class PortalPointCls extends PointCls {
  #team = null

  constructor(team, ...props) {
    super(...props)
    this.#team = team
  }

  get team() { return this.#team }
}

export class StartPointCls extends PointCls {
  #team = null

  constructor(team, ...props) {
    super(...props)
    this.#team = team
  }

  get team() { return this.#team }
}

export class CentralDistrictCls extends PointCls {
  constructor(...props) {
    super(...props)
  }
}

export class GoalPostCls extends PointCls {
  constructor(...props) {
    super(...props)
  }
}