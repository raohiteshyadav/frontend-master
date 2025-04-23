import React, { useRef, useEffect, useState } from "react";
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
  CloseButton,
  FormControl,
  FormLabel,
  Input,
  Select as ChakraSelect,
  Tag,
  HStack,
  useToast,
  CardHeader,
  Stack,
  Stat,
  StatNumber,
  StatHelpText,
  Heading,
  Flex,
  InputGroup,
  Badge,
  SimpleGrid,
  Tooltip,
  Progress,
  UnorderedList,
  ListItem,
  Image,
  InputRightElement,
} from "@chakra-ui/react";
import {
  ChevronLeft,
  ChevronRight,
  Clock2Icon,
  RefreshCw,
  Filter,
  PieChart,
  DnaIcon,
} from "lucide-react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

import AsyncSelect from "react-select/async";
import { debounce, toUpper } from "lodash";
import { Search2Icon } from "@chakra-ui/icons";
import ExcelReportDownloadButton from "./excelReportDownloadButton";
import Confetti from "./confetti";
import TicketDetails from "./ticketDetails";

const UserDetailsBox = ({ userDetails, onClose }) => (
  <Card
    position="fixed"
    top="86px"
    right="22px"
    bg="white"
    borderRadius="lg"
    boxShadow="xl"
    p={4}
    zIndex="overlay"
    maxWidth="350px"
  >
    <CardHeader backgroundColor="#edf2f7" borderRadius="md" display="flex" justifyContent="space-between" alignItems="center">
      <Heading size="md">User Details</Heading>
      <CloseButton onClick={onClose} />
    </CardHeader>
    <CardBody>
      <Stack spacing={2}>
        <HStack><Text fontWeight="bold">Name:</Text><Text>{userDetails.name}</Text></HStack>
        <HStack><Text fontWeight="bold">Email:</Text><Text>{userDetails.email}</Text></HStack>
        <HStack><Text fontWeight="bold">Employee ID:</Text><Text>{userDetails.id}</Text></HStack>
        <HStack><Text fontWeight="bold">Contact:</Text><Text>{userDetails.contact}</Text></HStack>
        <HStack><Text fontWeight="bold">Department:</Text><Text>{userDetails.department}</Text></HStack>
        <HStack><Text fontWeight="bold">Manager:</Text><Text>{userDetails.reportingTo}</Text></HStack>
        <HStack><Text fontWeight="bold">Role:</Text><Text>{userDetails.role}</Text></HStack>
      </Stack>
    </CardBody>
  </Card>
);

const DashboardIt = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const apiIp = process.env.REACT_APP_API_IP;
  const [lists, setLists] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const pageSize = 50;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState(
    searchParams.get('filtertype') || 'all'
  );
  const [filterStatus, setFilterStatus] = useState(
    searchParams.get('status') || 'all'
  );
  const [filterDate, setFilterDate] = useState(
    searchParams.get('date') || null
  );
  const [filterIt, setFilterIt] = useState(
    searchParams.get('it') || 'all'
  );
  const [selectedCreatedBy, setSelectedCreatedBy] = useState(
    searchParams.get('createdBy')
      ? { value: searchParams.get('createdBy'), label: searchParams.get('createdByLabel') }
      : null
  );
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [openIncident, setOpenIncident] = useState(0);
  const [openService, setOpenService] = useState(0);
  const [closeService, setCloseService] = useState(0);
  const [closeIncident, setCloseIncident] = useState(0);
  const [filterItUser, setFilterItUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [ticketNo, setTicketNo] = useState(null);
  const [viewTicket, setViewTicket] = useState(null);

  const fetchOptions = async (inputValue) => {
    const token = localStorage.getItem("token");
    if (!inputValue) {
      return [];
    }
    try {
      const response = await axios.get(
        `http://${apiIp}/user/users?searchText=${inputValue}`,
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

  const debouncedFetch = useRef(debounce((input, callback) => {
    fetchOptions(input).then(callback);
  }, 300)).current;

  const fetchItUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://${apiIp}/user/it-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilterItUser(response.data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch IT users",
        duration: 3000,
        status: "error",
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}/tickets/it?pageNumber=${currentPage}&pageSize=${pageSize}` +
        (filterDate ? `&date=${filterDate}` : "") +
        (filterType !== "all" ? `&type=${filterType}` : "") +
        (filterIt !== "all" ? `&it=${filterIt}` : "") +
        (filterStatus !== "all" ? `&status=${filterStatus}` : "") +
        (selectedCreatedBy ? `&createdBy=${selectedCreatedBy.value}` : "") +
        (ticketNo ? `&ticketNo=${ticketNo.replace(/[a-z]/g, (c) => toUpper(c))}` : ""),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setLists(data.lists);
      setTotalPages(data.totalPage);
      if (currentPage > data.totalPage) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        duration: 3000,
        status: "error",
      });
    } finally {
      setLoading(false);
      if (ticketNo) {
        setTicketNo('');
      }
    }
  };

  const fetchDashboard = async () => {
    setDashboardLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}/tickets/dashboard?dummy=dummy` +
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
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        duration: 3000,
        status: "error",
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    let count = 0;
    if (filterDate) count++;
    if (filterStatus !== "all") count++;
    if (filterType !== "all") count++;
    if (filterIt !== "all") count++;
    if (selectedCreatedBy) count++;
    setActiveFilterCount(count);
    fetchDashboard();
    fetchItUser();
  }, []);

  useEffect(() => {
    let count = 0;
    if (filterDate) count++;
    if (filterStatus !== "all") count++;
    if (filterType !== "all") count++;
    if (filterIt !== "all") count++;
    if (selectedCreatedBy) count++;
    setActiveFilterCount(count);

    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage);
    if (filterType !== 'all') params.set('filtertype', filterType);
    if (filterStatus !== 'all') params.set('status', filterStatus);
    if (filterDate) params.set('date', filterDate);
    if (filterIt !== 'all') params.set('it', filterIt);
    if (ticketNo) params.set('ticketNo', ticketNo);
    if (selectedCreatedBy) {
      params.set('createdBy', selectedCreatedBy.value);
      params.set('createdByLabel', selectedCreatedBy.label);
    }
    setSearchParams(params, { replace: true });
    fetchData();
    fetchDashboard();
  }, [currentPage, filterDate, filterType, filterStatus, filterIt, selectedCreatedBy]);

  const handleRefresh = () => {
    fetchData();
    fetchDashboard();
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedCreatedBy(selectedOption);
  };

  const handleRowClick = (id, type) => {
    navigate(`/service-request-form-dept/${id}?type=${type}` +
      (filterDate ? `&date=${filterDate}` : '') +
      (filterType !== 'all' ? `&type=${filterType}` : '') +
      (filterIt !== 'all' ? `&it=${filterIt}` : '') +
      (selectedCreatedBy ? `&createdBy=${selectedCreatedBy.value}&createdByLabel=${selectedCreatedBy.label}` : '') +
      (filterStatus !== 'all' ? `&status=${filterStatus}` : '')
    );
  };

  const handleCreatedBy = async (createdById) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}/user/info?id=${createdById}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setUserDetails(data);
    } catch (err) {
      console.error("Error in getting user details", err);
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        duration: 3000,
        status: "error",
      });
    }
  };

  const handleCloseUserDetails = () => {
    setUserDetails(null);
  };

  const applyFilters = () => {
    // setCurrentPage(1);
    // fetchData();
    // fetchDashboard();
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilterDate(null);
    setFilterStatus('all');
    setFilterType('all');
    setFilterIt('all');
    setSelectedCreatedBy(null);
    setTicketNo(null);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const calculateIncidentCompletionPercentage = () => {
    const total = openIncident + closeIncident;
    return total > 0 ? (closeIncident / total) * 100 : 100;
  };

  const calculateServiceCompletionPercentage = () => {
    const total = openService + closeService;
    return total > 0 ? (closeService / total) * 100 : 100;
  };

  return (
    <Box p={4} paddingBottom={0} minH="79vh" bg="gray.50">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
        <Card overflow={'hidden'} position={'relative'} cursor={'pointer'} userSelect={'none'} onDoubleClick={() => resetFilters()}>
          <Box
            height={'full'}
            position={'absolute'}
            opacity={0.3}
            right={-10}
            top={-3}
          >
            <DnaIcon color={'lightblue'} size={'180px'} />
          </Box>
          <CardHeader pb={1}>
            <Flex justify="space-between" align="center">
              <Heading size="sm">Total Tickets</Heading>
              <PieChart color="darkgreen" size={18} />
            </Flex>
          </CardHeader>
          <CardBody pt={1}>
            <Stat>
              <StatNumber fontSize="3xl">{openIncident + closeIncident + openService + closeService}</StatNumber>
              <StatHelpText mb={0}>
                <Badge colorScheme="blue">{filterDate ? new Date(filterDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Badge>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card overflow={'hidden'} cursor={'pointer'} userSelect={'none'} onDoubleClick={() => setFilterStatus('open')}>
          <CardHeader pb={1}>
            <Flex justify="space-between" align="center">
              <Heading size="sm">Open Tickets</Heading>
              <Clock2Icon color="green" size={18} />
            </Flex>
          </CardHeader>
          <CardBody pt={1}>
            <Stat>
              <StatNumber fontSize="3xl">{openIncident + openService}</StatNumber>
              <StatHelpText mb={0}>
                {(openIncident + openService) ?
                  <Badge colorScheme="orange">Requires Attention</Badge> :
                  <Badge colorScheme="green">All good</Badge>}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Confetti success={(openIncident + closeIncident + openService + closeService) && (activeFilterCount == 0) && (openIncident + openService === 0)} />

        <Card cursor={'pointer'} userSelect={'none'} onDoubleClick={() => setFilterType('Incident')}>
          <CardHeader pb={1}>
            <Flex justify="space-between" align="center">
              <Heading size="sm">Incidents</Heading>
              <Badge colorScheme={openIncident > 0 ? "red" : "green"}>
                {openIncident} Open
              </Badge>
            </Flex>
          </CardHeader>
          <CardBody pt={1}>
            <Text mb={1}>Resolved: {calculateIncidentCompletionPercentage().toFixed(0)}%</Text>
            <Progress value={calculateIncidentCompletionPercentage()} colorScheme="blue" size="sm" mb={2} />
            <Flex justify="space-between">
              <Text fontSize="sm">{closeIncident} Closed</Text>
              <Text fontSize="sm">{openIncident + closeIncident} Total</Text>
            </Flex>
          </CardBody>
        </Card>

        <Card cursor={'pointer'} userSelect={'none'} onDoubleClick={() => setFilterType('Service')}>
          <CardHeader pb={1}>
            <Flex justify="space-between" align="center">
              <Heading size="sm">Service Requests</Heading>
              <Badge colorScheme={openService > 0 ? "orange" : "green"}>
                {openService} Open
              </Badge>
            </Flex>
          </CardHeader>
          <CardBody pt={1}>
            <Text mb={1}>Resolved: {calculateServiceCompletionPercentage().toFixed(0)}%</Text>
            <Progress value={calculateServiceCompletionPercentage()} colorScheme="green" size="sm" mb={2} />
            <Flex justify="space-between">
              <Text fontSize="sm">{closeService} Closed</Text>
              <Text fontSize="sm">{openService + closeService} Total</Text>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
      <Card shadow="md" mb={0}>
        <CardHeader bg="white" borderTopRadius="md" py={3}>
          <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <InputGroup maxW="300px" >
              <InputRightElement
                _hover={{ bg: "blue.100", border: '2px solid #3182ce' }}
                borderRadius={'md'}
                cursor={'pointer'}
                onClick={() => fetchData()}
              >
                <Search2Icon color="blue.500" />
              </InputRightElement>
              <Input
                value={ticketNo || ''}
                onChange={(e) => setTicketNo(e.target.value)}
                placeholder="Search by ticket number..."
                variant="filled"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') fetchData();
                }}
              />
            </InputGroup>

            <HStack spacing={2}>
              <ExcelReportDownloadButton />
              <Tooltip label="Refresh data">
                <IconButton
                  aria-label="Refresh data"
                  icon={
                    <Box
                      transition="transform 0.3s ease-out"
                      _hover={{ transform: 'rotate(180deg)' }}
                    >
                      <RefreshCw size={18} />
                    </Box>}
                  onClick={handleRefresh}
                  isLoading={loading || dashboardLoading}
                  size="sm"
                />
              </Tooltip>
              <Box position="relative">
                <Button
                  leftIcon={<Filter size={16} />}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  colorScheme={activeFilterCount > 0 ? "blue" : "gray"}
                  size="sm"
                >
                  Filters
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
            </HStack>
          </Flex>
        </CardHeader>

        {isFilterOpen && (
          <Box
            p={4}
            bg="gray.50"
            borderBottom="1px"
            borderColor="gray.200"
            userSelect={'none'}
          >
            <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={4} mb={4}>
              <FormControl>
                <FormLabel fontSize="sm">Resolved By</FormLabel>
                <ChakraSelect
                  borderRadius={'md'}
                  borderColor={'#cccccc'}
                  size="sm"
                  bg="white"
                  value={filterIt}
                  onChange={(e) => setFilterIt(e.target.value)}
                  iconColor="#cccccc"
                  _hover={{ borderColor: '#b3b3b3' }}
                  _focus={{ borderColor: '#3182ce' }}
                >
                  <option value="all">All Staff</option>
                  {filterItUser.map((user) => (
                    <option key={user.id} value={user.id}>{user.label}</option>
                  ))}
                </ChakraSelect>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Created On</FormLabel>
                <Input
                  borderRadius={'md'}
                  borderColor={'#cccccc'}
                  size="sm"
                  bg="white"
                  type="date"
                  value={filterDate || ''}
                  onChange={(e) => setFilterDate(e.target.value)}
                  _hover={{ borderColor: '#b3b3b3' }}
                  _focus={{ borderColor: '#3182ce' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Created By</FormLabel>
                <AsyncSelect
                  cacheOptions
                  loadOptions={debouncedFetch}
                  onChange={handleSelectChange}
                  value={selectedCreatedBy}
                  placeholder="Search..."
                  isClearable
                  _focus={{ borderColor: '#3182ce' }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '32px',
                      maxHeight: '32px',
                      padding: '0px',
                      fontSize: '14px',
                      marginTop: '0px',
                      height: '32px',
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      padding: '2px 0px',
                      margin: '0px 4px',
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: '2px 0px',
                    }),
                    clearIndicator: (base) => ({
                      ...base,
                      padding: '2px 0px',
                      cursor: 'pointer',
                    }),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Ticket Type</FormLabel>
                <ChakraSelect
                  borderRadius={'md'}
                  borderColor={'#cccccc'}
                  size="sm"
                  bg="white"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  iconColor="#cccccc"
                  _hover={{ borderColor: '#b3b3b3' }}
                  _focus={{ borderColor: '#3182ce' }}
                >
                  <option value="all">All Types</option>
                  <option value="Incident">Incident</option>
                  <option value="Service">Service</option>
                </ChakraSelect>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Status</FormLabel>
                <ChakraSelect
                  borderRadius={'md'}
                  borderColor={'#cccccc'}
                  size="sm"
                  bg="white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  iconColor="#cccccc"
                  _hover={{ borderColor: '#b3b3b3' }}
                  _focus={{ borderColor: '#3182ce' }}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="close">Closed</option>
                </ChakraSelect>
              </FormControl>
            </SimpleGrid>

            <Flex justify="flex-end" gap={2}>
              <Button
                size="sm"
                variant="outline"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </Flex>
          </Box>
        )}

        <CardBody p={0}>
          <Box overflowX="auto" position={'relative'} minH={'50vh'} width="100%">
            <Table overflow={'auto'} variant="simple" size="sm" colorScheme="gray">
              <Thead bg="gray.50" >
                <Tr>
                  <Th>Ticket #</Th>
                  <Th p={1}>Created</Th>
                  <Th width="30%">Description</Th>
                  <Th p={1}>Created By</Th>
                  <Th p={1}>Status</Th>
                  <Th p={1}>Type</Th>
                  <Th p={1}>Approval<br /> Status</Th>
                  {/* <Th p={1}>Approver Remarks</Th> */}
                  <Th p={1}>Resolved By</Th>
                  <Th p={1}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lists.length === 0 ? (
                  <Tr>
                    <Td colSpan={10} py={6} textAlign="center">
                      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <Image
                          src="null.png"
                          maxH="50vh"
                          draggable={false}
                          userSelect="none"
                          alt="No data"
                        />
                      </Box>
                    </Td>
                  </Tr>

                ) : (
                  lists.map((request) => (
                    <Tr key={request.id} _hover={{ bg: "gray.50" }}>
                      <Td fontWeight="medium" color="blue.600" _hover={{ textDecor: 'underline', cursor: 'pointer' }} onClick={() => setViewTicket(request.id)}>
                        {request.sequenceNo}</Td>
                      <Td p={1}>{request.createdAt}</Td>
                      <Td>
                        <Tooltip label={<UnorderedList spacing={1} style={{ paddingLeft: "1rem", marginLeft: "-3px" }}>
                          {request.query.split('\n')?.map((line, i) => (
                            <ListItem key={i}>{line}</ListItem>
                          ))}
                        </UnorderedList>} hasArrow placement="top">
                          <Text noOfLines={2}>{request.query}</Text>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Text
                          cursor="pointer"
                          color="blue.600"
                          textDecoration="underline"
                          onClick={() => handleCreatedBy(request.createdById)}
                        >
                          {request.createdBy}
                        </Text>
                      </Td>
                      <Td p={1}>
                        <Badge colorScheme={request.resolvedAt ? "green" : "orange"}>
                          {request.resolvedAt ? "Closed" : "Open"}
                        </Badge>
                      </Td>
                      <Td p={1}>
                        <Badge minW={'64.5px'} justifyContent={'center'} alignItems={'center'} display={'flex'} colorScheme={request.type === "Incident" ? "red" : "blue"}>
                          {request.type}
                        </Badge>
                      </Td>
                      <Td p={1}>
                        {request.type === "Service" && (
                          <HStack spacing={1}>
                            <Tooltip label={request?.headApprovedAt ? "L1 Approved" : request.headRejectedAt ? "L1 Rejected" : "L1 Pending"}>
                              <Tag
                                p={1}
                                size="sm"
                                colorScheme={
                                  request?.headApprovedAt
                                    ? "green"
                                    : request.headRejectedAt
                                      ? "red"
                                      : "yellow"
                                }
                              >
                                L1 {request?.headApprovedAt ? "✓" : request.headRejectedAt ? "✗" : "⏱"}
                              </Tag>
                            </Tooltip>
                            <Tooltip label={request?.itHeadApprovedAt ? "L2 Approved" : request.itHeadRejectedAt ? "L2 Rejected" : "L2 Pending"}>
                              <Tag
                                p={1}
                                size="sm"
                                colorScheme={
                                  request?.itHeadApprovedAt
                                    ? "green"
                                    : request.itHeadRejectedAt
                                      ? "red"
                                      : "yellow"
                                }
                              >
                                L2 {request?.itHeadApprovedAt ? "✓" : request.itHeadRejectedAt ? "✗" : "⏱"}
                              </Tag>
                            </Tooltip>
                          </HStack>
                        )}
                      </Td>
                      {/* <Td p={1}>
                        <Tooltip label={request.itHeadRemark || "No remarks"}>
                          <Text noOfLines={1}>{request.itHeadRemark || "-"}</Text>
                        </Tooltip>
                      </Td> */}
                      <Td p={1}>{request.resolvedBy || "-"}</Td>
                      <Td p={1}>
                        <Button
                          size="sm"
                          colorScheme={request.resolvedBy ? "blue" : "green"}
                          onClick={() => handleRowClick(request.id, request.type)}
                        >
                          {request.resolvedBy ? "View" : "Resolve"}
                        </Button>
                      </Td>
                    </Tr>
                  ))
                )}
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
            borderBottomRadius="md"
            borderTop="1px"
            borderColor="gray.200"
          >
            <Button
              leftIcon={<ChevronLeft size={16} />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <HStack>
              <Text fontSize="sm">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </Text>
              <Text fontSize="sm" color="gray.500">
                ({lists.length} tickets)
              </Text>
            </HStack>

            <Button
              rightIcon={<ChevronRight size={16} />}
              size="sm"
              variant="outline"
              isDisabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </Box>
        </CardBody>

      </Card>

      {userDetails && (
        <UserDetailsBox
          userDetails={userDetails}
          onClose={handleCloseUserDetails}
        />
      )}
      {/* Ticket Details Modal */}
      < TicketDetails
        isOpen={!!viewTicket}
        onClose={() => setViewTicket(null)}
        ticketId={viewTicket}
        refreshTickets={fetchData}
        showFeedbackButton={false}
      />
    </Box>
  );
};

export default DashboardIt;