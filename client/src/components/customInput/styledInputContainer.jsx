import styled from "styled-components";
import device from "../../utils/mediaQuerySizes";

export const StyledInputContainer = styled.div`
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  &:focus-within label {
    -webkit-transform: translate(0, 5px) scale(0.8);
    transform: translate(0, 5px) scale(0.8);
    color: #999;
    margin-top: 0;
  }
  input,
  textarea {
    text-align: center;
    padding-top: 1rem;
    width: 100%;
    height: 5rem;
    font-weight: 600;
    font-size: 2rem;
    -webkit-transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    background: #fff;
    border-radius: 1rem;
    color: #111;
    -webkit-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    border: none;
    outline: none;
    resize: none;
  }
  textarea {
    height: 20rem;
    padding-top: 2rem;
  }
  label {
    position: absolute;
    pointer-events: none;
    -webkit-transform: translate(0, 23px) scale(1);
    transform: translate(0, 23px) scale(1);
    -webkit-transform-origin: top left;
    transform-origin: top left;
    -webkit-transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    color: #333;
    font-size: 1.4rem;
    left: 5px;
    top: 0;
    margin-top: -0.5rem;
    width: 20rem;
    height: -webkit-min-content;
    height: -moz-min-content;
    height: min-content;
    text-align: left;
    padding-left: 1rem;
    font-weight: 700;
  }
  .filled {
    -webkit-transform: translate(0, 5px) scale(0.8);
    transform: translate(0, 5px) scale(0.8);
    margin-top: 0;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  @media ${device.tablet} {
    label {
      -webkit-transform-origin: center top;
      transform-origin: center top;
      width: -webkit-max-content;
      width: -moz-max-content;
      width: max-content;
    }
  }
`;
