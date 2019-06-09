import styled from 'styled-components';

export const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const AcornButton = styled.button`
  color: white;
  display: inline-block;
  position: absolute;
  bottom: 10px;
  left: 50%;
  right: 50%;
  background: #3C64F4;
  border-radius: 4px;
  border: none;
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 28px;
  transform: translate(-50%, 0);
  width: 150px;
`;
