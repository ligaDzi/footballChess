import BallCls from './BallCls'

export default class TeamCls {
  #ball = null
  #name = null
  #color = null

  constructor(name, color) {
    this.#name = name
    this.#color = color
  }

  get name() { return this.#name }
  get color() { return this.#color }
  set ball(value) {
    if (value instanceof BallCls) {
      this.#ball = value
    }
  }

  step(point) {
    point.color = this.#color
    this.#ball.changePosition(point)
  }
}