import { PointCls } from './PointCls'
import { cornerNameEnum} from './helpers'

export default class FieldCls {
  #widthCell = null
  #heightCell = null
  #points = null
  #ball = null
  #pointsArroundBall = []
  #cornerArroundBall = null
  #markup = null  

  constructor(widthCell, heightCell, ball) {
    this.#points = PointCls.createPointArr(widthCell, heightCell)
    this.#ball = ball
    this.#widthCell = widthCell
    this.#heightCell = heightCell
  }

  get points() { return this.#points }
  get pointsArroundBall() { return this.#pointsArroundBall }
  get cornerArroundBall() { return this.#cornerArroundBall }
  get markup() {
    if (this.#markup) return this.#markup
    if (this.#points === null) return null
    this.__initialMarkup()
    return this.#markup
  }
  get widthField() {
    if (this.#points.length === 0) return 0

    return this.#points[this.#points.length-1].x
  }
  get heightField() {
    if (this.#points.length === 0) return 0

    return this.#points[this.#points.length-1].y
  }
  get kickPointsArroundBall() {
    if (!this.#ball || !this.#points) return null

    const listNamePoints = this.#ball.point.getNameKickPoints()
    return this.#points.filter(p => listNamePoints.includes(p.name))
  }

  /**
   * СРАБАТЫВАЕТ АВТОМАТИЧЕСКИ ПРИ ИЗМЕНЕНИИ ПОЗИЦИИ МЯЧА
   */
  updatePositionBall() {
    this.#points = this.#points.map(point => {
      if (point === this.#ball.point) point.checked = true
      return point
    })
    const listNamePoints = this.#ball.point.getNameArroundPoints()
    this.#pointsArroundBall = this.#points.filter(p => listNamePoints.includes(p.name))
    this.#cornerArroundBall = this.__getCornerPointsArroundBall(this.#ball.point, this.#pointsArroundBall)
  }

  updatePossibleMovePoints(possiblePoints) {
    this.#points = this.#points.map(point => {
      if (possiblePoints.includes(point)) {
        point.disabled = false
      } else {
        point.disabled = true
      }
      return point
    })
  }

  getCortegePArroundCArroundPoint(point) {
    const listNamePoints = point.getNameArroundPoints()
    
    const pointsArroundBall = this.#points.filter(p => listNamePoints.includes(p.name))
    const cornerArroundBall = this.__getCornerPointsArroundBall(point, pointsArroundBall)
    return [pointsArroundBall, cornerArroundBall]
  }

  __getCornerPointsArroundBall(pointBall, pointsArroundBall) {
    const cornerPoints = {
      leftTopCorner: { 
        corner: cornerNameEnum.LEFT_TOP, 
        point: null 
      },
      leftBottomCorner: { 
        corner: cornerNameEnum.LEFT_BOTTOM, 
        point: null 
      },
      rightTopCorner: { 
        corner: cornerNameEnum.RIGHT_TOP, 
        point: null 
      },
      rightBottomCorner: { 
        corner: cornerNameEnum.RIGHT_BOTTOM, 
        point: null 
      }
    }

    if (pointBall.x !== 0 && pointBall.y !== 0) {
      const x = pointBall.x - this.#widthCell
      const y = pointBall.y - this.#heightCell

      cornerPoints.leftTopCorner.point = pointsArroundBall.filter(p => p.x == x && p.y == y)[0] 
    }

    if (pointBall.x !== 0 && pointBall.y !== this.heightField) {
      const x = pointBall.x - this.#widthCell
      const y = pointBall.y + this.#heightCell

      cornerPoints.leftBottomCorner.point = pointsArroundBall.filter(p => p.x == x && p.y == y)[0] 
    }

    if (pointBall.x !== this.widthField && pointBall.y !== 0) {
      const x = pointBall.x + this.#widthCell
      const y = pointBall.y - this.#heightCell

      cornerPoints.rightTopCorner.point = pointsArroundBall.filter(p => p.x == x && p.y == y)[0] 
    }

    if (pointBall.x !== this.widthField && pointBall.y !== this.heightField) {
      const x = pointBall.x + this.#widthCell
      const y = pointBall.y + this.#heightCell

      cornerPoints.rightBottomCorner.point = pointsArroundBall.filter(p => p.x == x && p.y == y)[0] 
    }
    return cornerPoints
  }

  __initialMarkup() {  
    const initMarkup = {
      halfField: ['А18', 'Ь18'],
      centralDistrict: ['К15', 'Т15', 'Т21', 'К21'],
      homePortal: { first: ['К35', 'К36'], last: ['Т35', 'Т36'] },
      guestPortal: { first: ['К0', 'К1'], last: ['Т0', 'Т1'] },
      homePenaltyArea: ['З36', 'З29', 'Х29', 'Х36'],
      guestPenaltyArea: ['З0', 'З7', 'Х7', 'Х0'],
      sideLines: ['А0', 'Ь0', 'Ь36', 'А36']
    } 

    this.#markup = this.#points.reduce((markup, point) => {
      const { name, x, y } = point

      switch (true) {
        case markup.halfField.includes(name): 
          markup.halfField = this.__addXYInArrAndReturn(markup.halfField, name, x, y)
          return markup        
          
        case markup.centralDistrict.includes(name): 
          markup.centralDistrict = this.__addXYInArrAndReturn(markup.centralDistrict, name, x, y)
          return markup

        case markup.homePortal.first.includes(name):
          markup.homePortal.first = this.__addXYInArrAndReturn(markup.homePortal.first, name, x, y)
          return markup

        case markup.homePortal.last.includes(name):
          markup.homePortal.last = this.__addXYInArrAndReturn(markup.homePortal.last, name, x, y)
          return markup

        case markup.guestPortal.first.includes(name):
          markup.guestPortal.first = this.__addXYInArrAndReturn(markup.guestPortal.first, name, x, y)
          return markup

        case markup.guestPortal.last.includes(name):
          markup.guestPortal.last = this.__addXYInArrAndReturn(markup.guestPortal.last, name, x, y)
          return markup    

        case markup.homePenaltyArea.includes(name): 
          markup.homePenaltyArea = this.__addXYInArrAndReturn(markup.homePenaltyArea, name, x, y)
          return markup

        case markup.guestPenaltyArea.includes(name):
          markup.guestPenaltyArea = this.__addXYInArrAndReturn(markup.guestPenaltyArea, name, x, y)
          return markup

        case markup.sideLines.includes(name):
          markup.sideLines = this.__addXYInArrAndReturn(markup.sideLines, name, x, y)
          return markup

        default: return markup
      }
    }, initMarkup)
  }

  __addXYInArrAndReturn(arr, pointName, x, y) {
    const index = arr.indexOf(pointName)
    arr.splice(index, 1, x, y)
    return arr
  }
}