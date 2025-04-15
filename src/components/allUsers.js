import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Td,
  Tr,
  Box,
  Table,
  Thead,
  Th,
  IconButton,
  Tbody,
  Text,
  Flex,
  Badge,
  Heading,
  HStack,
  Skeleton,
  useColorModeValue,
  Tooltip,
  Avatar,
  Divider,
  VStack,
  Tag,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  RefreshCw, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  UserCheck 
} from "lucide-react";
import axios from "axios";

const AllUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;
  const apiIp = process.env.REACT_APP_API_IP;

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgHeader = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("blue.50", "blue.900");

  const fetchUsers = async () => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}/user/super-admin/users?pageNumber=${currentPage}&pageSize=${pageSize}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setUsers(data.lists);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchUsers();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  return (
    <Card w="full" maxW="7xl" shadow="md" borderRadius="lg" overflow="hidden">
      <CardHeader bg={bgHeader} py={4} px={6}>
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
          <Heading size="md" fontWeight="semibold">
            User Directory
          </Heading>
          <HStack spacing={3}>
            <InputGroup size="md" maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Search size={18} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                borderRadius="md"
              />
            </InputGroup>
            <Tooltip label="Refresh list">
              <IconButton
                icon={<RefreshCw size={18} />}
                size="md"
                variant="ghost"
                isLoading={loading}
                aria-label="Refresh users"
                onClick={() => fetchUsers()}
              />
            </Tooltip>
          </HStack>
        </Flex>
      </CardHeader>

      <CardBody p={0}>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg={bgHeader}>
              <Tr>
                <Th>User</Th>
                <Th>Email</Th>
                <Th>Department</Th>
                <Th>Contact</Th>
                <Th>Manager</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Tr key={index}>
                    <Td>
                      <Skeleton height="40px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                  </Tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <Tr 
                    key={user.id} 
                    _hover={{ bg: hoverBg }}
                    transition="background 0.2s"
                  >
                    <Td>
                      <HStack spacing={3}>
                        <Avatar 
                          name={user.name} 
                          size="sm" 
                          bg="blue.500" 
                          color="white"
                        />
                        <VStack spacing={0} align="start">
                          <Text fontWeight="medium">{user.name}</Text>
                          <Text fontSize="xs" color="gray.500">
                            ID: {user.id}
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Flex align="center">
                        <Mail size={14} color="gray.500" style={{ marginRight: "8px" }} />
                        <Text>{user.email}</Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Tag size="md" colorScheme="blue" variant="subtle">
                        <Briefcase size={12} style={{ marginRight: "5px" }} />
                        {user.department || "N/A"}
                      </Tag>
                    </Td>
                    <Td>
                      <Flex align="center">
                        <Phone size={14} color="gray.500" style={{ marginRight: "8px" }} />
                        <Text>{user.contact || "N/A"}</Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex align="center">
                        <UserCheck size={14} color="gray.500" style={{ marginRight: "8px" }} />
                        <Text>{user.manager || "N/A"}</Text>
                      </Flex>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5} py={8} textAlign="center">
                    <VStack spacing={3}>
                      <User size={40} opacity={0.3} />
                      <Text color="gray.500">No users found</Text>
                    </VStack>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>

        <Divider />

        <Flex 
          justify="space-between" 
          align="center" 
          p={4}
          bg={bgHeader}
        >
          <Text fontSize="sm" color="gray.600">
            Showing {users.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
            {(currentPage - 1) * pageSize + users.length} of {totalPages * pageSize}+ users
          </Text>
          <HStack>
            <IconButton
              icon={<ChevronLeft size={16} />}
              isDisabled={loading || currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              size="sm"
              variant="outline"
              colorScheme="blue"
              aria-label="Previous page"
            />
            <Text fontWeight="medium" px={2}>
              {currentPage} / {totalPages}
            </Text>
            <IconButton
              icon={<ChevronRight size={16} />}
              isDisabled={loading || currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              size="sm"
              variant="outline"
              colorScheme="blue"
              aria-label="Next page"
            />
          </HStack>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default AllUsers;