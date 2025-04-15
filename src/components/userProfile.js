import React, { useState } from "react";
import {
  Box,
  Stack,
  VStack,
  HStack,
  Avatar,
  Text,
  Divider,
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
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  useToast,
  Card,
  CardBody,
  Badge,
  Flex,
  Tooltip,
  Container,
  useBreakpointValue
} from "@chakra-ui/react";
import { KeyRound, Eye, EyeOff, User, Mail, Phone, Building, Users } from "lucide-react";
import axios from "axios";

const apiIp = process.env.REACT_APP_API_IP;

export const UserProfile = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPassword, setNewPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const token = localStorage.getItem("token");

  const avatarSize = useBreakpointValue({ base: "lg", md: "xl" });
  const nameSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const infoFontSize = useBreakpointValue({ base: "xs", md: "sm" });
  const valueFontSize = useBreakpointValue({ base: "sm", md: "md" });
  const iconSize = useBreakpointValue({ base: 14, md: 16 });
  const stackSpacing = useBreakpointValue({ base: 3, md: 6 });
  const cardPadding = useBreakpointValue({ base: 3, md: 6 });

  const handleChangePassword = async () => {
    if (!newPassword) {
      toast({
        title: "Password Required",
        description: "Please enter a new password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsChangingPassword(true);
      const response = await axios.post(
        `http://${apiIp}/user/change-password`,
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
          title: "Password Updated",
          description: "Your password has been changed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setNewPassword("");
        onClose();
      } else {
        toast({
          title: "Update Failed",
          description: "Unable to change password. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "System Error",
        description: error.response?.data?.message || "An error occurred while updating your password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getRoleBadge = (role) => {
    if (!role) return "Employee";

    switch (role.toLowerCase()) {
      case "it":
        return (
          <Badge colorScheme="purple" px={2} py={1}>
            IT DEPARTMENT
          </Badge>
        );
      case "head":
        return (
          <Badge colorScheme="blue" px={2} py={1}>
            Manager
          </Badge>
        );
      case "admin":
        return (
          <Badge colorScheme="red" px={2} py={1}>
            IT Head
          </Badge>
        );
      default:
        return (
          <Badge colorScheme="gray" px={2} py={1}>
            Employee
          </Badge>
        );
    }
  };

  return (
    <Container maxW="full" p={0}>
      <Card
        // shadow="md"
        borderRadius={"lg"}
        w="full"
        // mb={6}
        overflow="visible"
        borderTop="4px solid"
        borderColor="blue.400"
      >
        <CardBody p={0}>
          <Box p={cardPadding}>
            <Stack
              direction={"column"}
              spacing={stackSpacing}
              align={"center"}
              justify="center"
              w="full"
              mb={{ base: 4, md: 6 }}
            >
              <Avatar
                name={user?.name || "Guest"}
                size={avatarSize}
                bg="blue.500"
                color="white"
                shadow="md"
                src={user?.avatarUrl}
              />

              <VStack spacing={1} align={"center"}>
                <Text fontSize={nameSize} fontWeight="bold" color="gray.700" textAlign={{ base: "center", sm: "left" }}>
                  {user?.name || "Guest"}
                </Text>

                <HStack spacing={2} wrap="wrap" justify={{ base: "center", sm: "flex-start" }}>
                  {getRoleBadge(user?.role)}
                  <Text fontSize={infoFontSize} color="gray.500">
                    ID: {user?.id || "N/A"}
                  </Text>
                </HStack>
              </VStack>
            </Stack>

            <Divider mb={{ base: 4, md: 6 }} />

            <Flex
              direction={"column"}
              justify="space-around"
              align={"left"}
              w="full"
              gap={{ base: 6, md: 0 }}
            >
              <VStack
                align={"left"}
                spacing={4}
                w={"full"}
              >
                <VStack align={"left"} spacing={1}>
                  <HStack spacing={2}>
                    <Mail size={iconSize} color="#718096" />
                    <Text color="gray.500" fontSize={infoFontSize} fontWeight="medium">
                      Email
                    </Text>
                  </HStack>
                  <Text fontSize={valueFontSize} textAlign={"left"}>
                    {user?.email || "N/A"}
                  </Text>
                </VStack>

                <VStack align={"start"} spacing={1} mb={3}>
                  <HStack spacing={2}>
                    <Phone size={iconSize} color="#718096" />
                    <Text color="gray.500" fontSize={infoFontSize} fontWeight="medium">
                      Contact
                    </Text>
                  </HStack>
                  <Text fontSize={valueFontSize}>
                    {user?.contact || "N/A"}
                  </Text>
                </VStack>
              </VStack>

              <VStack
                align={"start"}
                spacing={4}
                w={"full"}
                mt={{ base: 0, md: 0 }}
              >
                <VStack align={"start"} spacing={1}>
                  <HStack spacing={2}>
                    <Building size={iconSize} color="#718096" />
                    <Text color="gray.500" fontSize={infoFontSize} fontWeight="medium">
                      Department
                    </Text>
                  </HStack>
                  <Text fontSize={valueFontSize}>
                    {user?.department || "N/A"}
                  </Text>
                </VStack>

                <VStack align={"start"} spacing={1}>
                  <HStack spacing={2}>
                    <Users size={iconSize} color="#718096" />
                    <Text color="gray.500" fontSize={infoFontSize} fontWeight="medium">
                      Reports To
                    </Text>
                  </HStack>
                  <Text fontSize={valueFontSize}>
                    {user?.reportingTo || "N/A"}
                  </Text>
                </VStack>
              </VStack>
            </Flex>
          </Box>

          <Box position="relative" h="10px">
            <Tooltip label="Change Password" placement="left">
              <IconButton
                icon={<KeyRound size={18} />}
                position="absolute"
                bottom={"4"}
                right={"4"}
                colorScheme="blue"
                aria-label="Change Password"
                onClick={onOpen}
                size="md"
                borderRadius="full"
                shadow="lg"
                zIndex={2}
              />
            </Tooltip>
          </Box>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={"sm"}
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent borderRadius="xl" shadow="xl" mx={4}>
          <ModalHeader pb={1}>Update Your Password</ModalHeader>
          <ModalCloseButton />

          <ModalBody pt={4}>
            <Text fontSize="sm" color="gray.500" mb={4}>
              Enter a new secure password for your account
            </Text>

            <FormControl>
              <FormLabel fontSize="sm">New Password</FormLabel>
              {/* <InputGroup size={useBreakpointValue({ base: "sm", md: "md" })}> */}
                <Input
                  // pr="4.5rem"
                  type= "password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {/* <InputRightElement>
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? <EyeOff key='hide' size={16} /> : <Eye key='off' size={16} />}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  />
                </InputRightElement>
              </InputGroup> */}
            </FormControl>
          </ModalBody>

          <ModalFooter pt={6}>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleChangePassword}
              isLoading={isChangingPassword}
              loadingText="Updating..."
              leftIcon={<KeyRound size={16} />}
              size={useBreakpointValue({ base: "sm", md: "md" })}
              w={{ base: "full", md: "auto" }}
            >
              Update Password
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              size={useBreakpointValue({ base: "sm", md: "md" })}
              display={{ base: "none", sm: "inline-flex" }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container >
  );
};