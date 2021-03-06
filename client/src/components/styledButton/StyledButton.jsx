import styled from "styled-components";
import device from "../../utils/mediaQuerySizes";

export const StyledButton = styled.button`
  border: none;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  padding: 0.8rem 2.4rem;
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  font-size: clamp(1.2rem, 2vw, 2rem);
  letter-spacing: 2px;
  border-radius: 8px;
  background-color: #e66d3993;
  -webkit-box-shadow: rgba(0, 0, 0, 0.3) 0px 9px 28px,
    rgba(0, 0, 0, 0.22) 0px 2px 5px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 9px 28px, rgba(0, 0, 0, 0.22) 0px 2px 5px;
  color: #fff;
  width: -webkit-max-content;
  width: -moz-max-content;
  width: max-content;
  cursor: pointer;
  &:active {
    -webkit-transition: -webkit-box-shadow 100ms ease-in-out;
    transition: -webkit-box-shadow 100ms ease-in-out;
    transition: box-shadow 100ms ease-in-out;
    transition: box-shadow 100ms ease-in-out,
      -webkit-box-shadow 100ms ease-in-out;
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
    -webkit-transition: -webkit-transform 100ms ease-in-out;
    transition: -webkit-transform 100ms ease-in-out;
    transition: transform 100ms ease-in-out;
    transition: transform 100ms ease-in-out, -webkit-transform 100ms ease-in-out;
    -webkit-box-shadow: rgba(0, 0, 0, 0.3) 0px 7px 21px,
      rgba(0, 0, 0, 0.22) 0px 1px 3px;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 7px 21px, rgba(0, 0, 0, 0.22) 0px 1px 3px;
  }
  @media ${device.tablet} {
    padding: 0.6rem 2rem;
  }
  @media ${device.mobileM} {
    padding: 0.4rem 1.6rem;
  }
`;
