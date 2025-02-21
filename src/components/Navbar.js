import { Menu } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Image, Box, Text } from "@chakra-ui/react";
import LogoutButton from "./logout";
import { useAuth } from "../providers/authProvider";

const Navbar = () => {
  const user = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const isLoginPage = location.pathname === "/login";

  return (
    <Nav display={"flex"} ref={navbarRef}>
      <Image
        marginLeft={"0"}
        src="https://blackbucks-media.s3.ap-south-1.amazonaws.com/Rashmi%20group%20logo%20White%20Bar-1738846415526.png"
        alt=""
        maxWidth={"170px"}
        height="auto"
        objectFit="contain"
        display="block"
        userSelect={"none"}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        //mt={-3}
        zIndex={999}
      />

      <Text
        display={["none", "none", "none", "none", "inline-block"]}
        fontWeight="bold"
        fontSize="3xl"
        bgGradient="linear(to-r, orange.500, white, green.500)"
        bgClip="text"
      >
        IT SELF SERVICE PORTAL
      </Text>

      <MenuToggle onClick={toggleMenu}>
        <Menu isOpen={isMenuOpen} />
      </MenuToggle>
      <NavLinks isOpen={isMenuOpen}>
        {!(user?.role === "employee" || user?.role === "head") && !isLoginPage && (
          <NavLink
            onClick={() => {
              user.role === "admin" ? navigate("/") : navigate("/home");
              toggleMenu();
            }}
          >
            {user?.role === "admin" ? "IT Head" : "IT Dept"}
          </NavLink>
        )}
        {(user?.role === "it" || user?.role === "admin") && !isLoginPage && (
          <NavLink
            onClick={() => {
              navigate("/superadmin");
              toggleMenu();
            }}
          >
            Super-Admin
          </NavLink>
        )}
        { !isLoginPage &&<NavLink
          onClick={() => {
            navigate("/raise-a-ticket");
            toggleMenu();
          }}
        >
          Raise A Ticket
        </NavLink>}
        {user?.role != "employee" && !isLoginPage && (
          <NavLink
            onClick={() => {
              navigate("/approval");
              toggleMenu();
            }}
          >
            Approval
          </NavLink>
        )}
        <NavLink
          onClick={() => {
            navigate("/contact");
            toggleMenu();
          }}
        >
          Contact Us
        </NavLink>
        <NavLink>
          <LogoutButton />
        </NavLink>
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  background-color: #333;
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
`;

const MenuToggle = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 60px;
    left: 0;
    background-color: #333;
    width: 100%;
    padding: 20px;
    gap: 10px;
    box-sizing: border-box;
  }
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2px;

  &:hover {
    color: #007bff;
    cursor: pointer;
  }
`;

export default Navbar;
