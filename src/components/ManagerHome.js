import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardBody,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Stack,
  VStack,
  Heading,
  Flex,
  Avatar,
  Container,
  Divider,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../providers/authProvider";
import { UserProfile } from "./userProfile";

const ManagerHome = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useAuth();
  const apiIp = process.env.REACT_APP_API_IP;
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}/tickets/approval?pageNumber=${currentPage}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setLists(data.lists);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPage);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleRowClick = (id) => {
    navigate(`/service-request-form/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
      bg="gray.50"
      minH="100vh"
    >
      {/* <Container maxW="7xl" p={0} m={0} mb={6}>
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
                Manager
              </Text>
              <Text fontSize="md" fontWeight="medium">
                {user?.manager || "N/A"}
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
      </Container> */}
      <UserProfile user ={user}/>
      <Card w="full" maxW="7xl" shadow="md" borderRadius="xl" overflow="hidden">
        <CardBody position="relative" pb={16}>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Ticket No.</Th>
                  <Th>Description</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                  <Th>Type</Th>
                  <Th>Date</Th>
                  <Th>Created By</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lists.map((request) => (
                  <Tr
                    key={request.id}
                    onClick={() => handleRowClick(request.id)}
                    style={{ cursor: "pointer" }}
                    _hover={{ bg: "gray.50" }}
                  >
                    <Td>{request.sequenceNo}</Td>
                    <Td>{request.query}</Td>
                    <Td color={request.resolvedAt ? "green.500" : "red.500"}>
                      {request.resolvedAt ? "Closed" : "Open"}
                    </Td>
                    <Td>
                      {request.headRejectedAt
                        ? "Rejected"
                        : request.headApprovedAt
                        ? "Approved"
                        : ""}
                    </Td>
                    <Td>{request.type}</Td>
                    <Td>{request.createdAt}</Td>
                    <Td>{request.createdBy}</Td>
                    <Td></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Box
            position="absolute"
            bottom={4}
            left={0}
            right={0}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={6}
          >
            <IconButton
              icon={<ChevronLeft />}
              isDisabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              variant="ghost"
              colorScheme="blue"
            />
            <Text fontWeight="medium">
              Page {currentPage} of {totalPages}
            </Text>
            <IconButton
              icon={<ChevronRight />}
              isDisabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              variant="ghost"
              colorScheme="blue"
            />
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ManagerHome;
