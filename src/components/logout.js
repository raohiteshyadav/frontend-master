import React from "react";
import { Button } from "@chakra-ui/react";
import { FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Button
    onClick={handleLogout}
    p={3}
    borderRadius={'25px'}
    color={'red.400'}
    _hover={{
        bg: "red.200", // Red background when hovered
        color: "white", // White icon color on hover
      }}
      _active={{
        bg: "red.600", // Darker red when the button is clicked
      }}>
      <FaPowerOff />
    </Button>
  );
};

export default LogoutButton;
