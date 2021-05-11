import { det, abs, sqrt, square } from 'mathjs'

import { CentralDistrictCls, GoalPostCls } from './PointCls'

import { cornerNameEnum, logValue } from './helpers'

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

  static isPointGoalPost(point) {
    if (point instanceof GoalPostCls) return true

    return false
  }

  /**
   * ОКРУЖЕНА ЛИ ТОЧКА. Т.Е. ВОЗМОЖНО ЛИ ДАЛЬНЕЙШЕЕ ДВИЖЕНИЕ ИЗ НЕЕ. 
   * ЭТО НУЖНО ЗНАТЬ ПРИ УДАРАХ / ПЕРЕДАЧАХ, ВОЗМОЖНО ЛИ ПЕРЕДАТЬ В ЭТУ ТОЧКУ МЯЧ.
   * @param {PointCls} point 
   * @param {StepList} steps 
   * @param {FieldCls} field 
   * @param {RefereeCls} referee 
   * @returns boolen
   */
  static isPointSurrounded(point, steps, field, referee) {
    const count = steps.countStepThroughPoint(point)
    if (count < 2) {
      const isPointCentralDistrict = point instanceof CentralDistrictCls
      const [arroundPoint, cornerArroundPoint] = field.getCortegePArroundCArroundPoint(point)
      const possibalMove = referee.getPossibleMovePoints(arroundPoint, cornerArroundPoint, steps, isPointCentralDistrict)
      if (isPointCentralDistrict) {
        const possibleMovePointsCentral = referee.getPossibleMovePointsCentral(point, possibalMove, field, steps)
        const isBlock = !possibleMovePointsCentral.length
        return isBlock
      }
      const isBlock = !referee.isPossible3MoveStep(point, possibalMove, field, steps)
      return isBlock
    }
    return false
  } 

  /**
   * ЗАБЛОКИРОВАННА ЛИ УГЛАВАЯ ТОЧКА
   * @param {PoinCls} point 
   * @param {String} corner 
   * @param {Array} arroundPoint 
   * @param {StepsList} steps 
   * @returns boolen
   */
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

  /**
   * ЗАБЛОКИРОВАННА ЛИ УГЛАВАЯ ТОЧКА В ЦЕНТРАЛЬНОМ КРУГЕ
   * @param {PoinCls} point 
   * @param {String} corner 
   * @param {Array} arroundPoint 
   * @param {StepsList} steps 
   * @returns boolen
   */
  static isCornerPointNOTBlockCentral(point, corner, arroundPoint, steps) {
    const rightPoint = this.__getRightPoint(point.x, point.y, arroundPoint)
    const leftPoint = this.__getLeftPoint(point.x, point.y, arroundPoint)
    const topPoint = this.__getTopPoint(point.x, point.y, arroundPoint)
    const bottomPoint = this.__getBottomPoint(point.x, point.y, arroundPoint)
    
    switch (corner) {
      case cornerNameEnum.LEFT_TOP:
        return !(rightPoint.checked && bottomPoint.checked && steps.isConnectionPoints(rightPoint, bottomPoint))
      case cornerNameEnum.LEFT_BOTTOM:
        return !(rightPoint.checked && topPoint.checked && steps.isConnectionPoints(rightPoint, topPoint))        
      case cornerNameEnum.RIGHT_TOP:
        return !(leftPoint.checked && bottomPoint.checked && steps.isConnectionPoints(leftPoint, bottomPoint))
      case cornerNameEnum.RIGHT_BOTTOM:
        return !(leftPoint.checked && topPoint.checked && steps.isConnectionPoints(leftPoint, topPoint))
    }
  }

  /**
   * ПОПАЛ ЛИ МЯЧ В ШТАНГУ
   * @param {PointCls} pointBall 
   * @param {PointCls} pointKick 
   * @param {PointCls} pointGoalPost 
   * @returns boolen
   */
  static isBallHitGoalPost(pointBall, pointKick, pointGoalPost) {
    // ДЛИННА ОТРЕЗКА
    const s1 = sqrt(square(pointBall.x - pointKick.x) + square(pointBall.y - pointKick.y))

    // СУММА РОСТОЯНИЙ ДО ТОЧКИ
    const s2 = sqrt(square(pointBall.x - pointGoalPost.x) + square(pointBall.y - pointGoalPost.y))
    const s3 = sqrt(square(pointKick.x - pointGoalPost.x) + square(pointKick.y - pointGoalPost.y))
    const sum = s2 + s3

    // ТОЧНОСТЬ ПРОВЕРКИ
    const PRECISION = 0.001

    if (abs(s1 - sum) < PRECISION) return true

    return false
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