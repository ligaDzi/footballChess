import { CentralDistrictCls } from './PointCls'

import { cornerNameEnum } from './helpers'

export default class RulesCls {
  static widthField = null
  static heightField = null
  static widthCell = null
  static heightCell = null

  static init(widthField, heightField, widthCell, heightCell) {
    this.widthField = widthField
    this.heightField = heightField
    this.widthCell = widthCell
    this.heightCell = heightCell
  }

  static isPointFree(point) {
    return !point.checked
  }

  static isPointNOTCentralDistrict(point) {
    if (point instanceof CentralDistrictCls) return false

    return true
  }

  static isPointSurrounded(point, steps, field, referee) {
    const count = steps.countStepThroughPoint(point)
    if (count < 2) {
      const [arroundPoint, cornerArroundPoint] = field.getCortegePArroundCArroundPoint(point)
      const possibalMove = referee.getPossibleMovePoints([point], arroundPoint, cornerArroundPoint, steps)
      const isBlock = !possibalMove.length
      return isBlock
    }

    return false
  } 

  static isCornerPointNOTBlock(point, corner, arroundPoint, steps) {
    const rightPoint = this.__getRightPoint(point.x, point.y, arroundPoint)
    const leftPoint = this.__getLeftPoint(point.x, point.y, arroundPoint)
    const topPoint = this.__getTopPoint(point.x, point.y, arroundPoint)
    const bottomPoint = this.__getBottomPoint(point.x, point.y, arroundPoint)
    
    switch (corner) {
      case cornerNameEnum.LEFT_TOP:
        return !(
          RulesCls.__isTroughCentr(rightPoint, bottomPoint) || 
          (rightPoint.checked && bottomPoint.checked && steps.isConnectionPoints(rightPoint, bottomPoint))
        )
      case cornerNameEnum.LEFT_BOTTOM:
        return !(
          RulesCls.__isTroughCentr(rightPoint, topPoint) || 
          (rightPoint.checked && topPoint.checked && steps.isConnectionPoints(rightPoint, topPoint))
        )
      case cornerNameEnum.RIGHT_TOP:
        return !(
          RulesCls.__isTroughCentr(leftPoint, bottomPoint) || 
          (leftPoint.checked && bottomPoint.checked && steps.isConnectionPoints(leftPoint, bottomPoint))
        )
      case cornerNameEnum.RIGHT_BOTTOM:
        return !(
          RulesCls.__isTroughCentr(leftPoint, topPoint) ||
          (leftPoint.checked && topPoint.checked && steps.isConnectionPoints(leftPoint, topPoint))
        )
    }
  }

  static __getRightPoint(x, y, points) {
    return points.find(p => (p.x == (x + this.widthCell) && p.y == y))
  }

  static __getBottomPoint(x, y, points) {
    return points.find(p => (p.x == x && p.y == (y + this.heightCell)))
  }

  static __getTopPoint(x, y, points) {
    return points.find(p => (p.x == x && p.y == (y - this.heightCell)))
  }

  static __getLeftPoint(x, y, points) {
    return points.find(p => (p.x == (x - this.widthCell) && p.y == y))
  }

  static __isTroughCentr(adjacentPoint1, adjacentPoint2) {
    return adjacentPoint1 instanceof CentralDistrictCls || adjacentPoint2 instanceof CentralDistrictCls
  }
}