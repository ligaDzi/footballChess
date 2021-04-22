import { PointCls } from './PointCls'

export default class BallCls {
  #point = null
  #observers = []

  constructor() {

  }

  get point() { return this.#point }
  set point(value) {
    if (value instanceof PointCls) {
      this.#point = value
    }
  }
  
  attach(observer) {
    this.#observers.push(observer)
  }
  
  detach(observer) {
    this.#observers = this.#observers.filter(o => o != observer)
  }

  changePosition(point) {
    this.#point = point

    this._notifyPosition()
  }

  _notifyPosition() {
    this.#observers.forEach(obs => {
      obs.updatePositionBall()
    });
  }
}