import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select as ChakraSelect,
  useToast,
  Flex,
  TagLabel,
  Tag,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon, ChevronLeft, ChevronRight, Clock2Icon, SlidersHorizontalIcon, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { debounce } from "lodash";
import { FiSearch } from "react-icons/fi";
import { Search2Icon } from "@chakra-ui/icons";

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const apiIp = process.env.REACT_APP_API_IP;
  const [lists, setLists] = useState([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState(null);
  const pageSize = 50;
  const [openIncident, setOpenIncident] = useState(0);
  const [openService, setOpenService] = useState(0);
  const [closeService, setCloseService] = useState(0);
  const [closeIncident, setCloseIncident] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState(null);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [filterIt, setFilterIt] = useState("all");
  const [filterItUser, setFilterItUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [ticketNo, setTicketNo] = useState(null);

  const fetchOptions = async (inputValue) => {
    const token = localStorage.getItem("token");
    if (!inputValue) {
      return [];
    }
    try {
      const response = await axios.get(
        `http://${apiIp}:3000/user/users?searchText=${inputValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.map((u) => ({ value: u.value, label: u.label }));
    } catch (err) {
      console.log("Not fetched user tickets");
      return [];
    }
  };

  const debouncedFetchOptions = useCallback(debounce(fetchOptions, 100), []);
  const fetchItUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://${apiIp}:3000/user/it-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilterItUser(response.data);
    } catch (err) {
      toast({
        title: "Error",
        description: "",
        duration: "3000",
        status: "error",
      });
    }
  };
  const handleRowClick = (id) => {
    navigate(`/service-request-form-it/${id}`);
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}:3000/tickets/it?pageNumber=${currentPage}&pageSize=${pageSize}` +
          (filterDate ? `&date=${filterDate}` : "") +
          (filterType !== "all" ? `&type=${filterType}` : "") +
          (filterIt !== "all" ? `&it=${filterIt}` : "") +
          (filterStatus !== "all" ? `&status=${filterStatus}` : "") +
          (selectedCreatedBy ? `&createdBy=${selectedCreatedBy.value}` : ""),
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
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}:3000/tickets/dashboard?dummy=dummy` +
          (filterDate ? `&date=${filterDate}` : "") +
          (filterIt !== "all" ? `&it=${filterIt}` : ""),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setCloseIncident(data.closeIncident);
      setCloseService(data.closeService);
      setOpenService(data.openService);
      setOpenIncident(data.openIncident);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveFilterCount(0);
    fetchDashboard();
    fetchItUser();
  }, []);
  useEffect(() => {
    let count = 0;
    if (filterDate) count++;
    if (filterStatus !== "all") count++;
    if (filterType !== "all") count++;
    if (filterIt !== "all") count++;
    if(selectedCreatedBy) count++;
    setActiveFilterCount(count);
    fetchData();
  }, [
    currentPage,
    filterDate,
    filterType,
    filterStatus,
    filterIt,
    selectedCreatedBy,
  ]);

  useEffect(() => {
    fetchDashboard();
  }, [filterDate, filterIt]);
  const handleSelectChange = (selectedOption) => {
    setSelectedCreatedBy(selectedOption);
  };

  return (
    <Box p={6}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={6}>
        <Card bg="blue.50">
          <CardHeader>
            <Heading size="md">Incident Requests</Heading>
          </CardHeader>
          <CardBody>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              justifyContent={{ md: "space-between" }}
              align="center"
            >
              <Stat>
                <StatLabel>All</StatLabel>
                <StatNumber color="blue.500">
                  {openIncident + closeIncident}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Open</StatLabel>
                <StatNumber color="red.500">{openIncident}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Closed</StatLabel>
                <StatNumber color="green.500">{closeIncident}</StatNumber>
              </Stat>
            </Stack>
          </CardBody>
        </Card>

        <Card bg="gray.50">
          <CardHeader>
            <Heading size="md">Service Requests</Heading>
          </CardHeader>
          <CardBody>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              justifyContent={{ md: "space-between" }}
              align="center"
            >
              <Stat>
                <StatLabel>All</StatLabel>
                <StatNumber color="blue.500">
                  {openService + closeService}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Open</StatLabel>
                <StatNumber color="red.500">{openService}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Closed</StatLabel>
                <StatNumber color="green.500">{closeService}</StatNumber>
              </Stat>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Card pt={"20px"} minH={"50vh"}>
        <CardBody position="relative">
          <Flex align="center" gap={2}>
            <Box display={"flex"} gap={4} w={"full"}>
              <Box display="flex" alignItems="center" max width={"250px"}>
                <Input
                  maxHeight={"36px"}
                  value={ticketNo}
                  onChange={(e) => setTicketNo(e.target.value)}
                  placeholder="Search..."
                  size="lg"
                  border="2px solid gray"
                  borderTop="none"
                  borderLeft="none"
                  borderRight="none"
                  borderRadius={0}
                  _focusVisible={false}
                  _focus={{
                    borderColor: "none",
                  }}

                  // paddingRight="120px"
                />

                {/* Lucid Search Button */}
                <Button
                  maxHeight={"36px"}
                  isLoading={loading}
                  loadingText="Searching..."
                  colorScheme="teal"
                  p={0}
                  margin={1}
                  variant="none"
                  borderRadius="md"
                  marginLeft="-4px" // Slightly overlap with the input field
                  height="100%"
                  width="120px" // Adjust the width to your needs
                >
                  <Search2Icon color="blue.500" />
                </Button>
              </Box>
            </Box>
            <Box display={"flex"} position={"relative"}>
              <Button
                borderRadius="md"
                cursor="pointer"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontalIcon />
              </Button>
              {activeFilterCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-7px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "12px",
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </Box>
          </Flex>
          {isFilterOpen && (
            <Box
              boxShadow={"md"}
              borderRadius={"md"}
              gap={4}
              display={"flex"}
              position={"absolute"}
              zIndex={11}
              backgroundColor="#edf2f7"
              p={4}
              top={"70px"}
              right={"20px"}
            >
              <FormControl w={"3sm"}>
                <FormLabel>Resolved By</FormLabel>
                <ChakraSelect
                  bg={"white"}
                  value={filterIt}
                  onChange={(e) => {
                    setFilterIt(e.target.value);
                  }}
                >
                  <option value="all">All</option>
                  {filterItUser.map((user) => (
                    <option value={user.id}>{user.label}</option>
                  ))}
                </ChakraSelect>
              </FormControl>
              <FormControl w={'3sm'}>
                <FormLabel>Created By</FormLabel>
                <AsyncSelect
                  cacheOptions
                  loadOptions={debouncedFetchOptions} // Debounced function for options
                  onChange={handleSelectChange} // On selection change
                  value={selectedCreatedBy} // Currently selected value
                  placeholder="Search created by User"
                  isClearable
                  styles={{
                    minWidth: "250px",
                    container: (provided) => ({
                      ...provided,
                      minWidth: "250px", // Ensure the container also gets minWidth
                    }),
                  }}
                />
              </FormControl>
              <FormControl w={"3sm"}>
                <FormLabel>Created On</FormLabel>
                <Input
                  bg={"white"}
                  type="date"
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                  }}
                ></Input>
              </FormControl>
              <FormControl w={"3sm"}>
                <FormLabel>Ticket Type</FormLabel>
                <ChakraSelect
                  bg={"white"}
                  size={"md"}
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                  }}
                >
                  <option value={"all"}>All</option>
                  <option value={"Incident"}>Incident</option>
                  <option value={"Service"}>Service</option>
                </ChakraSelect>
              </FormControl>
              <FormControl w={"3sm"}>
                <FormLabel>Status</FormLabel>
                <ChakraSelect
                  bg={"white"}
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                  }}
                >
                  <option value={"all"}>All</option>
                  <option value={"open"}>Open</option>
                  <option value={"close"}>Close</option>
                </ChakraSelect>
              </FormControl>
            </Box>
          )}
          {/* Table Container */}
          <Box overflowX="auto" maxWidth="100%" mb={4}>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>S.N.</Th>
                  <Th>Created On</Th>
                  <Th>Ticket No.</Th>
                  <Th>Description</Th>
                  <Th>Created By</Th>
                  <Th>Status</Th>
                  <Th>Type</Th>
                  <Th>Action</Th>
                  <Th> Level of Approvement</Th>
                  <Th>Remark by IT</Th>
                  <Th>Resolved By</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lists.map((request, index) => (
                  <Tr key={request.id}>
                    <Td>{(currentPage - 1) * pageSize + index + 1}</Td>
                    <Td>{request.createdAt}</Td>
                    <Td>{request.sequenceNo}</Td>
                    <Td>{request.query}</Td>
                    <Td>{request.createdBy}</Td>
                    <Td color={request.resolvedAt ? "green.500" : "red.500"}>
                      {request.resolvedAt ? "Closed" : "Open"}
                    </Td>
                    <Td>{request.type}</Td>
                    <Td>
                      <Box display={"flex"} gap={2}>
                        {request.type !== "Incident" && (
                          <Button
                            onClick={() => handleRowClick(request.id)}
                            style={{ cursor: "pointer" }}
                            _hover={{ bg: "gray.50" }}
                            p={2}
                            color={"green.400"}
                          >
                            Approve
                          </Button>
                        )}
                      </Box>
                    </Td>
                    <Td padding={"5px 10px"}>
                      {request.type === "Service" && (
                        <VStack gap={1} alignItems={"left"}>
                          <HStack spacing={4}>
                            <Tag
                              minWidth={"50px"}
                              size={"md"}
                              key={"md"}
                              borderRadius="full"
                              variant="solid"
                              colorScheme={
                                request?.headApprovedAt
                                  ? "green"
                                  : request.headRejectedAt
                                  ? "red"
                                  : "yellow"
                              }
                            >
                              <TagLabel mr={"8px"}>L1</TagLabel>
                              {request?.headApprovedAt ? (
                                <CheckIcon
                                  style={{ color: "white.800" }}
                                  size={"14px"}
                                />
                              ) : request.headRejectedAt ? (
                                <X
                                  style={{ color: "white.800" }}
                                  size={"14px"}
                                />
                              ) : (
                                <Clock2Icon
                                  style={{ color: "white.800" }}
                                  size={"14px"}
                                />
                              )}
                            </Tag>
                          </HStack>
                          <HStack spacing={4}>
                            <Tag
                              minWidth={"50px"}
                              size={"md"}
                              key={"md"}
                              borderRadius="full"
                              variant="solid"
                              colorScheme={
                                request?.itHeadApprovedAt
                                  ? "green"
                                  : request.itHeadRejectedAt
                                  ? "red"
                                  : "yellow"
                              }
                            >
                              <TagLabel mr={"8px"}>L2</TagLabel>
                              {request?.itHeadApprovedAt ? (
                                <CheckIcon
                                  style={{ color: "white.800" }}
                                  size={"14px"}
                                />
                              ) : request.itHeadRejectedAt ? (
                                <X
                                  style={{ color: "white.800" }}
                                  size={"14px"}
                                />
                              ) : (
                                <Clock2Icon
                                  style={{ color: "white.800" }}
                                  size={"14px"}
                                />
                              )}
                            </Tag>
                          </HStack>
                        </VStack>
                      )}
                    </Td>
                    <Td>{request.remark}</Td>
                    <Td>{request.resolvedBy ?? "Not resolved"}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Box width={"full"} h={10}></Box>
        </CardBody>
        {/* Pagination and Chevron Buttons */}
        <Box
          display="flex"
          position="absolute"
          bottom={4}
          m={"auto"}
          width="full"
          justifyContent="space-between"
        >
          <IconButton
            icon={<ChevronLeft />}
            isDisabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          />
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <IconButton
            icon={<ChevronRight />}
            isDisabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default Dashboard;
