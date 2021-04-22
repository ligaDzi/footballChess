import styled from 'styled-components'


export const DotContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 50px 0 50px 100px;
  display: grid;
  grid: ${props => `repeat(14, ${props.theme.size}) / repeat(29, ${props.theme.size})`} ;
`

export const Dot = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid green;
  & > div {
    width: ${props => props.theme.size};
    height: ${props => props.theme.size};
  }
`

Dot.defaultProps = {
  theme: {
    size: "50px"
  }
}
DotContent.defaultProps = {
  theme: {
    size: "50px"
  }
}

export const DotInput = styled.input`
  position: absolute;
  margin: 50% auto;
  left: 0;
  right: 0;
  transform: translate(0, -50%);
  padding: 0;
`

export const ClockHand12 = styled.div`
  position: absolute;
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  top: 0;
  left: 0;
  margin: auto 50%;
  width: 2px;
  height: 50%;
  background-color: ${props => props.color || 'grey'};
`

export const ClockHand1 = styled(ClockHand12)`
  left: 25%;
  transform: rotate(45deg);
`

export const ClockHand3 = styled(ClockHand12)`
  top: 25%;
  left: 25%;
  transform: rotate(90deg);
`

export const ClockHand4 = styled(ClockHand12)`
  top: 50%;
  left: 25%;
  transform: rotate(135deg);
`

export const ClockHand6 = styled(ClockHand12)`
  top: 50%;
`
export const ClockHand7 = styled(ClockHand12)`
  top: 50%;
  left: -25%;
  transform: rotate(45deg);
`
export const ClockHand9 = styled(ClockHand12)`
  top: 25%;
  left: -25%;
  transform: rotate(90deg);
`
export const ClockHand10 = styled(ClockHand12)`
  top: 0;
  left: -25%;
  transform: rotate(135deg);
`