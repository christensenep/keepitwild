import styled from 'styled-components';

export const StyledHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #222;
  height: 53px;
  overflow: visible;
  align-items: center;
  z-index: 5000;
  flex: 0 1 auto;
`;

export const Logo = styled.img`
  align-self: start;
  width: 64px;
  height: 64px;
`;

export const Menu = styled.img`
  width: 48px;
  height: 48px;
`;

export const Search = styled.img`
  width: 48px;
  height: 48px;
`;
