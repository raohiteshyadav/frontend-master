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
  IconButton,
  Flex,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { BoxIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../providers/authProvider";
import { UserProfile } from "./userProfile";

const ManagerHome = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 25;
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
    <Box bg="gray.50" minH="100vh" py={6} paddingBottom={0} px={{ base: 4, md: 8 }}>
      <Box maxW="1400px" mx="auto" pb={2}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          position={'relative'}
          gap={8}
          mb={0}
        >
          <Box
            alignSelf="start"
            position={{ base: 'auto', lg: 'sticky' }}
            top={{ lg: 106 }}
            w={{ base: "full", lg: "300px" }}
            minW={{ base: "full", lg: "300px" }}
          >
            <UserProfile user={user} />
          </Box>

          <Box flex={1} overflow={'hidden'}>
            <Box
              mb={6}
              p={6}
              borderRadius="lg"
              bg="blue.500"
              color="white"
              backgroundImage="linear-gradient(to right, #3182CE, #4299E1)"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                right="-10px"
                top="-15px"
                opacity={0.1}
                transform="rotate(15deg)"
              >
                <BoxIcon size={140} />
              </Box>
              <VStack align="start" spacing={2} position="relative" zIndex={1}>
                <Heading size="lg">Manager Dashboard</Heading>
                <Text>Approve or reject your team service requests</Text>
              </VStack>
            </Box>
            <Card shadow="sm" borderRadius="lg" w="auto">
              <CardBody position="relative" pb={2}>
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
                  position="sticky"
                  bottom={0}
                  left={0}
                  right={0}
                  display="flex"
                  bg={'white'}
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
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
        </Flex>
      </Box>
    </Box>
  );
};

export default ManagerHome;