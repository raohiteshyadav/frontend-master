import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Avatar,
  Container,
  Divider,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/authProvider";

const SuperAdmin = () => {
  const user = useAuth(); 
  const navigate = useNavigate();
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
      bg="gray.50"
      minH="100vh"
    >
      <Container maxW="7xl" p={0} m={0} mb={6}>
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={{ base: 4, md: 8 }}
                align="center"
                justify="center"
                bg="white"
                p={4}
                borderRadius="xl"
                shadow="lg"
                w="full"
              >
                <VStack spacing={4} align="center" w={{ base: "full", md: "auto" }}>
                  <Avatar
                    name={user?.name || "Guest"}
                    size="2xl"
                    bg="teal.500"
                    color="white"
                    shadow="lg"
                  />
                  <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                    {user?.name || "Guest"}
                  </Text>
                </VStack>
      
                <Divider
                  orientation={{ base: "horizontal", md: "vertical" }}
                  h={{ base: "1px", md: "120px" }}
                />
      
                <VStack
                  spacing={4}
                  align="start"
                  flex={1}
                  align-item="flex-start"
                  width={["full", "full", "auto"]}
                >
                  <Box>
                    <Text color="gray.500" fontSize="sm">
                      Email
                    </Text>
                    <Text fontSize="md" fontWeight="medium">
                      {user?.email || "N/A"}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">
                      EmployeeID
                    </Text>
                    <Text fontSize="md" fontWeight="medium">
                      {user?.id || "N/A"}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">
                      Role
                    </Text>
                    <Text fontSize="md" fontWeight="medium">
                      {user?.role || "N/A"}
                    </Text>
                  </Box>
                </VStack>
      
                <Divider
                  orientation={{ base: "horizontal", md: "vertical" }}
                  h={{ base: "1px", md: "120px" }}
                />
      
                <VStack
                  spacing={4}
                  align="start"
                  flex={1}
                  align-item="flex-start"
                  width={["full", "full", "auto"]}
                >
                  <Box>
                    <Text color="gray.500" fontSize="sm">
                      Reporting Manager
                    </Text>
                    <Text fontSize="md" fontWeight="medium">
                      {user?.reportingTo || "N/A"}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">
                      Department
                    </Text>
                    <Text fontSize="md" fontWeight="medium">
                      {user?.department || "N/A"}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">
                      Contact Number
                    </Text>
                    <Text fontSize="md" fontWeight="medium">
                      {user?.contact || "N/A"}
                    </Text>
                  </Box>
                </VStack>
              </Stack>
            </Container>

      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: "6", md: "auto" }}
        mb={10}
        justify={["center", "space-between"]}
        align="center"
        w="full"
        maxW="7xl"
      >
        <VStack
          spacing={4}
          w={{ base: "full", md: "500px" }}
          border="2px"
          borderColor="gray.200"
          borderRadius="xl"
          p={4}
          bg="white"
          shadow="lg"
          transition="all 0.3s"
          _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
        >
          <Button
            onClick={() => navigate("/superadmin-userlist")}
            w="full"
            h="70px"
            fontSize="xl"
            fontWeight="bold"
            bg="blue.500"
            color="white"
            borderRadius="lg"
            _hover={{
              bg: "blue.600",
              transform: "scale(1.02)",
            }}
            _active={{
              bg: "blue.700",
              transform: "scale(0.98)",
            }}
            transition="all 0.2s"
          >
            Add User
          </Button>
          <Text
            color="blue.600"
            fontSize="lg"
            fontWeight="medium"
            textAlign="center"
          >
            Add new users to the system.
          </Text>
        </VStack>

        <VStack
          spacing={4}
          w={{ base: "full", md: "500px" }}
          border="2px"
          borderColor="gray.200"
          borderRadius="xl"
          p={4}
          bg="white"
          shadow="lg"
          transition="all 0.3s"
          _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
        >
          <Button
            onClick={() => navigate("/superadmin-category")}
            w="full"
            h="70px"
            fontSize="xl"
            fontWeight="bold"
            bg="green.500"
            color="white"
            borderRadius="lg"
            _hover={{
              bg: "green.600",
              transform: "scale(1.02)",
            }}
            _active={{
              bg: "green.700",
              transform: "scale(0.98)",
            }}
            transition="all 0.2s"
          >
            Add Categories
          </Button>
          <Text
            color="green.600"
            fontSize="lg"
            fontWeight="medium"
            textAlign="center"
          >
            Manage categories for users.
          </Text>
        </VStack>
      </Stack>
    </Box>
  );
};

export default SuperAdmin;
