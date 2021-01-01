import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NavComponent = () => {
  return (
    <>
      <Nav>
        <li>
          <Link to="/main">Main</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/editProfile">EditProfile</Link>
        </li>
      </Nav>
    </>
  );
};

export default NavComponent;

const Nav = styled.ul`
  li {
    list-style-type: none;
    margin: 0 10px;
    display: inline-block;
  }
`;
