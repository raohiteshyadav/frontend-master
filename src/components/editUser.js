import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Select,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import { FiUserPlus } from "react-icons/fi";
import axios from "axios";
import { Search2Icon } from "@chakra-ui/icons";
import { CookingPot } from "lucide-react";

const EditUser = () => {
  const apiIp = process.env.REACT_APP_API_IP;
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
    contact: "",
    department: "",
    reportingTo: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://${apiIp}/user/info?id=${formData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setFormData((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
          contact: data.contact,
          department: data.department,
          reportingTo: data.reportingToId,
          role: data.role,
        }));
      } catch (err) {
        setFormData((prev) => ({
          ...prev,
          name: "",
          email: "",
          contact: "",
          department: "",
          reportingTo: "",
          role: "",
        }));
        console.error("Error in getting user details", err);
      } finally {
        setLoading(false);
      }
    };

    if (formData.id !== "") {
      fetchData();
    }
  }, [formData.id, apiIp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://${apiIp}/user/edit-user/${formData.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        toast({
          title: "Success",
          description: "User deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch(e) {
      toast({
        title: "Failure",
        description: e?.response?.data?.message || "Error while deleting user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `http://${apiIp}/user/edit-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "User details updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating data",
        description: "Failed to update user details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VStack spacing={6}>
      <Stack w={'full'} gap={4} display={{ base: 'box', md: 'flex' }} direction={{ base: 'column', md: 'row' }}>
        <FormControl isRequired>
          <FormLabel>Employee Id</FormLabel>
          <InputGroup>
            <Input
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="Enter employee ID"
              variant="filled"
            />
            <InputRightElement>
              <Search2Icon color="blue.500" />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            variant="filled"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Contact</FormLabel>
          <Input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Enter contact"
            variant="filled"
          />
        </FormControl>
        </Stack>

        <Stack w={'full'} gap={4} display={{ base: 'box', md: 'flex' }} direction={{ base: 'column', md: 'row' }}>
        <FormControl isRequired>
          <FormLabel>Department</FormLabel>
          <Input
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Enter Department"
            variant="filled"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Reporting Manager Id</FormLabel>
          <Input
            name="reportingTo"
            value={formData.reportingTo}
            onChange={handleChange}
            placeholder="Enter ID of your manager"
            variant="filled"
          />
        </FormControl>
        </Stack>

        <FormControl isRequired>
          <FormLabel>Role</FormLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Select Role"
            variant="filled"
          >
            <option value="admin" disabled>
              IT Head
            </option>
            <option value="it">IT Department</option>
            <option value="head">Manager</option>
            <option value="employee">Employee</option>
          </Select>
        </FormControl>

        <Box
          display={"flex"}
          gap={4}
          justifyContent={"space-around"}
          w={"full"}
        >
          <Button
            width={"full"}
            colorScheme="red"
            disabled={!formData.name}
            onClick={handleDelete}
          >
            <CookingPot size={16} /> &nbsp; Delete User
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={
              !formData.name ||
              !formData.department ||
              !formData.contact ||
              !formData.id ||
              !formData.role
            }
            width={"full"}
            leftIcon={<FiUserPlus />}
          >
            Update User
          </Button>
        </Box>
      </VStack>
    </>
  );
};

export default EditUser;
