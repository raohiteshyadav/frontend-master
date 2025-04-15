import React, { useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Text,
  Button,
  Flex,
  VStack,
  Heading,
  Divider,
  useColorModeValue,
  Container,
  SimpleGrid
} from "@chakra-ui/react";
import {
  Users,
  Tag,
  Settings,
  ShieldCheckIcon,
  AlertTriangle,
  LayoutDashboard,
  HomeIcon,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/authProvider";
import AllUsers from "./allUsers";
import { UserProfile } from "./userProfile";
import UserList from "./itsuperadmin";
import UserCat from "./itsuperadmincat";

const SuperAdmin = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("user-list");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const scrollToMainContent = (offset = 200) => {
    const element = document.getElementById('main-content');
    const bodyTop = document.body.getBoundingClientRect().top;
    const elementTop = element.getBoundingClientRect().top;
    const scrollTo = elementTop - bodyTop - offset;

    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
  };

  return (
    <Box bg={bgColor} minH="100vh" py={6} px={{ base: 4, md: 8 }}>
      <Container maxW="1400px" p={0} mx={'auto'}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={8}
        >
          <Box w={{ base: "full", lg: "300px" }} minW={{ base: "full", lg: "300px" }}>
            <Card shadow="sm" borderRadius="lg" overflow="hidden">
              <CardBody p={0}>
                <UserProfile user={user} />
              </CardBody>
            </Card>

            <Card mt={6} shadow="sm" borderRadius="lg" overflow="hidden">
              <CardBody p={0}>
                <VStack spacing={0} divider={<Divider />} align="stretch">
                  <Box p={4} bg="gray.50">
                    <Heading size="sm" fontWeight="semibold">Admin Actions</Heading>
                  </Box>

                  <Button
                    justifyContent="flex-start"
                    leftIcon={<Users size={16} />}
                    colorScheme="blue"
                    variant="ghost"
                    borderRadius={0}
                    h="50px"
                    onClick={() => { setSelectedTab("user-management"); scrollToMainContent(); }}
                  >
                    User Management
                  </Button>

                  <Button
                    justifyContent="flex-start"
                    leftIcon={<Tag size={16} />}
                    colorScheme="green"
                    variant="ghost"
                    borderRadius={0}
                    h="50px"
                    onClick={() => { setSelectedTab("category-management"); scrollToMainContent(); }}
                  >
                    Category Management
                  </Button>

                  <Button
                    justifyContent="flex-start"
                    leftIcon={<Settings size={16} />}
                    variant="ghost"
                    borderRadius={0}
                    h="50px"
                    disabled
                  >
                    System Settings
                  </Button>

                  <Button
                    justifyContent="flex-start"
                    leftIcon={<AlertTriangle size={16} />}
                    variant="ghost"
                    borderRadius={0}
                    h="50px"
                    disabled
                  >
                    Alerts Management
                  </Button>

                  <Button
                    justifyContent="flex-start"
                    leftIcon={<HomeIcon size={16} />}
                    variant="ghost"
                    borderRadius={0}
                    h="50px"
                    onClick={() => { setSelectedTab("user-list"); scrollToMainContent(400); }}
                  >
                    Return to Home
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </Box>

          <Box flex={1} overflow="auto">
            <Box
              mb={6}
              p={6}
              borderRadius="lg"
              bg="blue.500"
              color="white"
              backgroundImage="linear-gradient(to right, #2C5282, #3182CE)"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                right="-8px"
                top="-8px"
                opacity={0.1}
                transform="rotate(15deg)"
              >
                <ShieldCheckIcon color="white" size={130} />
              </Box>
              <VStack align="start" spacing={2} position="relative" zIndex={1}>
                <Heading size="lg">Super Admin Dashboard</Heading>
                <Text>Manage users, categories, and system settings</Text>
              </VStack>
            </Box>

            {selectedTab === "user-list" && <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={6}>
              <Card
                p={5}
                shadow="sm"
                borderRadius="lg"
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => { setSelectedTab("user-management"); scrollToMainContent(); }}
                borderLeft="4px solid"
                borderColor="blue.500"
              >
                <Flex align="center">
                  <Box
                    p={3}
                    borderRadius="full"
                    bg="blue.100"
                    color="blue.500"
                    mr={3}
                  >
                    <Users size={18} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">User Management</Text>
                    <Text fontSize="sm" color="gray.500">Add, edit, or manage system users</Text>
                  </VStack>
                </Flex>
              </Card>

              <Card
                p={5}
                shadow="sm"
                borderRadius="lg"
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => { setSelectedTab("category-management"); scrollToMainContent(); }}
                borderLeft="4px solid"
                borderColor="green.500"
              >
                <Flex align="center">
                  <Box
                    p={3}
                    borderRadius="full"
                    bg="green.100"
                    color="green.500"
                    mr={3}
                  >
                    <Tag size={18} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">Category Management</Text>
                    <Text fontSize="sm" color="gray.500">Manage ticket categories</Text>
                  </VStack>
                </Flex>
              </Card>
            </SimpleGrid>}

            <Card shadow="sm" borderRadius="lg">
              <Button
                position={'absolute'}
                right={7}
                top={7}
                leftIcon={<ChevronLeft size={16} />}
                size="sm"
                zIndex={9}
                variant="outline"
                display={selectedTab === 'user-list' ? 'none' : 'flex'}
                onClick={() => { setSelectedTab("user-list"); scrollToMainContent(400); }}
              >
                Back
              </Button>
              <CardBody id="main-content" p={0}>
                {selectedTab === "user-list" && <AllUsers />}
                {selectedTab === "user-management" && <UserList />}
                {selectedTab === "category-management" && <UserCat />}
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default SuperAdmin;