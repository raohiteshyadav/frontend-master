import React, { useState } from "react";
import {
  Container,
  Stack,
  VStack,
  Avatar,
  Text,
  Divider,
  Box,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { FaKey } from "react-icons/fa"; // For change password icon
import axios from "axios";

const apiIp = process.env.REACT_APP_API_IP;

export const UserProfile = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPassword, setNewPassword] = useState("");
  const toast = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const token = localStorage.getItem("token");

  const handleChangePassword = async () => {
    if (!newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsChangingPassword(true);
      // Call your API to change the password
      const response = await axios.post(
        `http://${apiIp}:3000/user/change-password`,
        {
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Password changed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose(); // Close the modal after success
      } else {
        toast({
          title: "Error",
          description: "Failed to change the password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while changing the password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Container position={"relative"} maxW="7xl" p={0} m={0} mb={6}>
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

      {/* Change Password Icon */}
      <IconButton
        icon={<FaKey />}
        position="absolute"
        bottom="20px"
        right="20px"
        colorScheme="teal"
        aria-label="Change Password"
        onClick={onOpen}
        size="lg"
        borderRadius="full"
        shadow="lg"
      />

      {/* Modal for Change Password */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={handleChangePassword}
              isLoading={isChangingPassword}
            >
              Change Password
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};
