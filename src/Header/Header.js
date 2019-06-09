import React from 'react';
import { Logo, Search, Menu, StyledHeader } from './styled';

export default class Header extends React.Component {

  render() {
    return (
      <StyledHeader>
        <Menu src='menu.jpg'/>
        <Logo src='logo.png'/>
        <Search src='search.jpg'/>
      </StyledHeader>
    );
  }
}
