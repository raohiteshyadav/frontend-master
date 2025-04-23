import React, { useEffect, useRef } from "react";
import { Menu, User, Home, PhoneCall, ShieldCheckIcon, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Image,
  Text,
  IconButton,
  Collapse,
  useDisclosure,
  useColorModeValue,
  Button,
  VStack,
  HStack,
  Divider,
  useBreakpointValue
} from "@chakra-ui/react";
import LogoutButton from "./logout";
import { useAuth } from "../providers/authProvider";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);

  const bgColor = useColorModeValue("#1a202c", "#2D3748");
  const titleGradient = "linear(to-r, orange.400, white, green.400)";
  // const mobileView = useBreakpointValue({ base: true, md: false });
  const displayTitle = useBreakpointValue({ base: false, md: false, lg: true });
  const selectedItem = window.location.pathname;
  const tabMapping = {
    'Raise A Ticket': '/raise-a-ticket',
    'Contact Us': '/contact',
    'IT Dept': '/home',
    'IT Head': '/home',
    'Super-Admin': '/superadmin',
    'Approval': '/approval',
    'IT Head': '/'
  };

  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target) && isOpen) {
      onToggle();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) onToggle();
  }, [location.pathname]);

  const isLoginPage = location.pathname === "/login";

  const getNavItems = () => {
    const items = [];

    if (!(user?.role === "employee" || user?.role === "head" || !user) && !isLoginPage) {
      items.push({
        label: user?.role === "admin" ? "IT Head" : "IT Dept",
        icon: <Home size={18} />,
        onClick: () => navigate(user?.role === "admin" ? "/" : "/home")
      });
    }

    if (user && (user?.role === "it" || user?.role === "admin") && !isLoginPage) {
      items.push({
        label: "Super-Admin",
        icon: <ShieldCheckIcon size={18} />,
        onClick: () => navigate("/superadmin")
      });
    }

    if (user && !isLoginPage) {
      items.push({
        label: "Raise A Ticket",
        icon: <FileText size={18} />,
        onClick: () => navigate("/raise-a-ticket")
      });
    }

    if (user && user?.role !== "employee" && user?.role !== "it" && !isLoginPage) {
      items.push({
        label: "Approval",
        icon: <User size={18} />,
        onClick: () => navigate("/approval")
      });
    }

    items.push({
      label: "Contact Us",
      icon: <PhoneCall size={18} />,
      onClick: () => navigate("/contact")
    });

    return items;
  };

  const navItems = getNavItems();

  return (
    <Box ref={navbarRef} position="sticky" top={0} zIndex={100}>
      <Flex
        bg={bgColor}
        color="white"
        minH="60px"
        py={2}
        px={4}
        align="center"
        justify="space-between"
        borderBottom="1px"
        borderColor="gray.700"
        boxShadow="md"
      >
        <Flex align="center">
          <Image
            src="/logo.png"
            alt=""
            maxW={{ base: "130px", md: "130px" }}
            h="auto"
            objectFit="contain"
            userSelect="none"
            onClick={() => navigate('/raise-a-ticket')}
            cursor={'pointer'}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />

          {displayTitle && (
            <Text
              ml={4}
              fontWeight="bold"
              fontSize={{ lg: "2xl", xl: "3xl" }}
              bgGradient={titleGradient}
              bgClip="text"
              userSelect={'none'}
              letterSpacing="wide"
            >
              IT SELF SERVICE PORTAL
            </Text>
          )}
        </Flex>
        <IconButton
          border={'2px solid white'}
          display={{ base: "flex", md: "none" }}
          onClick={onToggle}
          p={0}
          m={0}
          icon={<Menu size={24} />}
          variant="ghost"
          aria-label="Toggle Navigation"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
        />

        <HStack spacing={5} display={{ base: "none", md: "flex" }}>
          {navItems.map((item, index) => (
            // <Tooltip key={index} label={item.label} placement="bottom" hasArrow>
            <Button
              key={index}
              variant="ghost"
              leftIcon={item.icon}
              onClick={item.onClick}
              color={tabMapping[item.label] == selectedItem ? "#2D2E2E" : "#fbfbfb"}
              bg={tabMapping[item.label] == selectedItem ? "#fbfbfb" : "none"}
              _hover={{ bg: "#fbfbfb", color: "#2D2E2E" }}
              size="sm"
              px={2}
            >
              {item.label}
            </Button>
            // </Tooltip>
          ))}

          {!isLoginPage && (
            <LogoutButton />
          )}
        </HStack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <VStack
          bg={bgColor}
          p={4}
          display={{ md: "none" }}
          spacing={4}
          divider={<Divider borderColor="gray.700" />}
          align="stretch"
          boxShadow="md"
          zIndex={100}
        >
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              leftIcon={item.icon}
              onClick={item.onClick}
              justifyContent="flex-start"
              color={tabMapping[item.label] == selectedItem ? "cyan" : "white"}
              bg={tabMapping[item.label] == selectedItem ? "whiteAlpha.200" : "none"}
              _hover={{ bg: "whiteAlpha.200" }}
              size="md"
            >
              {item.label}
            </Button>
          ))}

          {!isLoginPage && (
            <Box pt={2}>
              <LogoutButton key={'logout'} fullWidth={true} />
            </Box>
          )}
        </VStack>
      </Collapse>
    </Box>
  );
};

export default Navbar;