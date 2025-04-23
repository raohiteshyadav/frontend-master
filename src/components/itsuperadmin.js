import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  Flex,
  useColorModeValue,
  Select,
  Stack,
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
import { FiUpload, FiUserPlus, FiUsers, FiKey, FiEdit2 } from "react-icons/fi";
import axios from "axios";
import EditUser from "./editUser";

const UserList = () => {
  const [passwordChangeId, setPasswordChangeId] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [data, setData] = useState([]);
  const [newUser, setNewUser] = useState({
    id: "RML",
    name: "",
    email: "",
    contact: "",
    department: "",
    reportingTo: "",
    role: "",
    passkey: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  const apiIp = process.env.REACT_APP_API_IP;
  const token = localStorage.getItem("token");

  const cardBg = useColorModeValue("white", "gray.700");
  // const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const workbook = XLSX.read(event.target.result, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const formattedData = jsonData.map((row) => ({
            id: row["ID"],
            name: row["Name"],
            email: row["Email"],
            contact: String(row["Contact"]),
            department: row["Dept"],
            reportingTo: row["Reporting To"]
              ? String(row["Reporting To"])
              : undefined,
            role: row["Role"],
            passkey: String(row["passkey"]),
          }));

          setData(formattedData);
          toast({
            title: "File Processed",
            description: "Excel file has been successfully processed.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to process the Excel file.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handlePostData = async () => {
    setIsUploading(true);
    try {
      const response = await fetch(`http://${apiIp}/user/bulk-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) throw new Error("Upload failed");

      toast({
        title: "Success",
        description: "Data uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUser = async () => {
    if (
      !newUser.name ||
      !newUser.department ||
      !newUser.contact ||
      !newUser.role ||
      !newUser.id
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const userPayload = [newUser];

    try {
      setIsUploading(true);

      const response = await fetch(`http://${apiIp}/user/bulk-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: userPayload }),
      });

      if (!response.ok) throw new Error("User addition failed");

      toast({
        title: "Success",
        description: "New user added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setNewUser({
        id: "RML",
        name: "",
        email: "",
        contact: "",
        department: "",
        reportingTo: "",
        role: "",
        password: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handlePasswordChange = async () => {
    if (!passwordChangeId) {
      toast({
        title: "Error",
        description: "Please enter RML ID",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsChangingPassword(true);

      const response = await axios.post(
        `http://${apiIp}/user/reset-password`,
        {
          id: passwordChangeId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 201) throw new Error("Password change failed");

      toast({
        title: "Success",
        description: "Password reset done.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setPasswordChangeId("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process password change",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Card minH={"70vh"} bg={cardBg}>
      <CardHeader borderBottom={'1px solid gray'}>
        <Flex align="center" gap={2}>
          <FiUsers size="24px" />
          <Text fontSize="3xl">User Management</Text>
        </Flex>
      </CardHeader>

      <CardBody>
        <Tabs isLazy isFitted variant="soft-rounded" colorScheme="blue">
          <TabList
            overflowX="hidden"
            mb={4}
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
            w="100%"
          >
            <Tab>
              <Flex align="center" gap={2}>
                <FiUpload />
                <Text>Upload Excel</Text>
              </Flex>
            </Tab>
            <Tab>
              <Flex align="center" gap={2}>
                <FiUserPlus />
                <Text>Add User</Text>
              </Flex>
            </Tab>
            <Tab>
              <Flex align="center" gap={2}>
                <FiEdit2 />
                <Text>Edit User</Text>
              </Flex>
            </Tab>
            <Tab>
              <Flex align="center" gap={2}>
                <FiKey />
                <Text>Reset Password</Text>
              </Flex>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel minHeight={"50vh"}>
              <VStack spacing={6} align="stretch">
                <Flex gap={4} p={2}>
                  <Input
                    pt={1}
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    variant="filled"
                    flex={1}
                  />
                  <Button
                    colorScheme="blue"
                    onClick={handlePostData}
                    isLoading={isUploading}
                    loadingText="Uploading..."
                    isDisabled={data.length === 0}
                    leftIcon={<FiUpload />}
                  >
                    Upload
                  </Button>
                </Flex>

                {data.length > 0 ? (
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ID</Th>
                          <Th>Name</Th>
                          <Th>Email</Th>
                          <Th>Contact</Th>
                          <Th>Department</Th>
                          <Th>Role</Th>
                          <Th>Manager</Th>
                          <Th>Password</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data.map((item, index) => (
                          <Tr key={index}>
                            <Td>{item.id}</Td>
                            <Td>{item.name}</Td>
                            <Td>{item.email}</Td>
                            <Td>{item.contact}</Td>
                            <Td>{item.department}</Td>
                            <Td>{item.role}</Td>
                            <Td>{item.reportingTo}</Td>
                            <Td>{item.passkey}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                ) : (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    Upload an Excel file to preview data
                  </Alert>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6}>
                <Stack w={'full'} gap={4} display={{ base: 'box', md: 'flex' }} direction={{ base: 'column', md: 'row' }}>
                  <FormControl isRequired>
                    <FormLabel>Employee Id</FormLabel>
                    <Input
                      value={newUser.id}
                      onChange={(e) =>
                        setNewUser({ ...newUser, id: e.target.value })
                      }
                      placeholder="Enter ID"
                      variant="filled"
                    />
                  </FormControl>
                  <FormControl isRequired mb={{ base: 6, md: 'auto' }}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      placeholder="Enter name"
                      variant="filled"
                    />
                  </FormControl>
                </Stack>

                <Stack w={'full'} gap={4} display={{ base: 'box', md: 'flex' }} direction={{ base: 'column', md: 'row' }}>

                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      placeholder="Enter email"
                      variant="filled"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Contact</FormLabel>
                    <Input
                      value={newUser.contact}
                      onChange={(e) =>
                        setNewUser({ ...newUser, contact: e.target.value })
                      }
                      placeholder="Enter contact"
                      variant="filled"
                    />
                  </FormControl>
                </Stack>

                <Stack w={'full'} gap={4} display={{ base: 'box', md: 'flex' }} direction={{ base: 'column', md: 'row' }}>
                  <FormControl isRequired>
                    <FormLabel>Department</FormLabel>
                    <Input
                      value={newUser.department}
                      onChange={(e) =>
                        setNewUser({ ...newUser, department: e.target.value })
                      }
                      placeholder="Enter Department"
                      variant="filled"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Reporting Manager Id</FormLabel>
                    <Input
                      value={newUser.reportingTo}
                      onChange={(e) =>
                        setNewUser({ ...newUser, reportingTo: e.target.value })
                      }
                      placeholder="Enter ID of your manager"
                      variant="filled"
                    />
                  </FormControl>
                </Stack>

                <Stack w={'full'} gap={4} display={{ base: 'box', md: 'flex' }} direction={{ base: 'column', md: 'row' }}>
                  <FormControl isRequired>
                    <FormLabel>Role</FormLabel>
                    <Select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      placeholder="Select Role"
                      variant="filled"
                    >
                      <option value="it">IT Department</option>
                      <option value="head">Manager</option>
                      <option value="employee">Employee</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                      value={newUser.passkey}
                      onChange={(e) =>
                        setNewUser({ ...newUser, passkey: e.target.value })
                      }
                      placeholder="Enter Password"
                      variant="filled"
                    />
                  </FormControl>
                </Stack>

                <Button
                  colorScheme="blue"
                  onClick={handleAddUser}
                  isDisabled={
                    !newUser.name ||
                    !newUser.department ||
                    !newUser.contact ||
                    !newUser.id ||
                    !newUser.role
                  }
                  width="full"
                  leftIcon={<FiUserPlus />}
                >
                  Add User
                </Button>
              </VStack>
            </TabPanel>
            <TabPanel>
              <EditUser />
            </TabPanel>
            <TabPanel minHeight={"50vh"}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel>RML ID</FormLabel>
                  <Input
                    value={passwordChangeId}
                    onChange={(e) => setPasswordChangeId(e.target.value)}
                    placeholder="Enter RML ID"
                    variant="filled"
                  />
                </FormControl>

                <Button
                  colorScheme="blue"
                  onClick={handlePasswordChange}
                  isLoading={isChangingPassword}
                  loadingText="Processing..."
                  isDisabled={!passwordChangeId}
                  width="full"
                  leftIcon={<FiKey />}
                >
                  Reset Password
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card >
  );
};

export default UserList;
