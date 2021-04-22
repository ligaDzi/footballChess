export const uid = () => Date.now().toString(36) + Math.random().toString(36)

export const halfEnum = { 
  HOME: 'home', 
  GUEST: 'guest', 
  HOME_AND_GUEST: 'all' }

export const modeGameEnum = {
  HOME_START: 'HOME_START',
  HOME_BALL: 'HOME_BALL',
  HOME_KICK: 'HOME_KICK',
  HOME_CENTR: 'HOME_CENTR',
  HOME_RICOCHET: 'HOME_RICOCHET',
  HOME_GOAL: 'HOME_GOAL',
  GUEST_START: 'GUEST_START',
  GUEST_BALL: 'GUEST_BALL',
  GUEST_KICK: 'GUEST_KICK',
  GUEST_CENTR: 'GUEST_CENTR',
  GUEST_RICOCHET: 'GUEST_RICOCHET',
  GUEST_GOAL: 'GUEST_GOAL',
  END_GAME: 'END_GAME'
}

export const cornerNameEnum = {
  LEFT_TOP: 'LEFT_TOP',
  LEFT_BOTTOM: 'LEFT_BOTTOM',
  RIGHT_TOP: 'RIGHT_TOP',
  RIGHT_BOTTOM: 'RIGHT_BOTTOM'
}