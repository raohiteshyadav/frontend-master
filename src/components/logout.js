
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, useToast, Box, useBreakpointValue } from "@chakra-ui/react";
import { LogOut } from "lucide-react";

const LogoutButton = ({ fullWidth = false }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const buttonSize = useBreakpointValue({ base: "md", md: "sm" });

  const handleLogout = () => {
    localStorage.removeItem("token");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <Button
      leftIcon={<LogOut size={18} />}
      onClick={handleLogout}
      colorScheme="red"
      variant="outline"
      size={buttonSize}
      w={fullWidth ? "100%" : "auto"}
      _hover={{ bg: "red.100", color: "red.700" }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;