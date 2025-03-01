import React, { useEffect, useState } from "react";
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
  Select,
  useToast,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, SlidersHorizontalIcon } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const apiIp = process.env.REACT_APP_API_IP;
  const [lists, setLists] = useState([]);
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
  const [filterIt, setFilterIt] = useState('all');
  const [filterItUser, setFilterItUser] = useState([]);

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
          (filterStatus !== "all" ? `&status=${filterStatus}` : ""),
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
        `http://${apiIp}:3000/tickets/dashboard?dummy=dummy`+
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
    setActiveFilterCount(count);
    fetchData();
  }, [currentPage, filterDate, filterType, filterStatus, filterIt]);

  useEffect(()=>{
    fetchDashboard();
  },[filterDate,filterIt])

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
          <Button
            position={"absolute"}
            zIndex={9}
            top={"-15px"}
            right={"20px"}
            borderRadius={"md"}
            cursor={"pointer"}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontalIcon />
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
          </Button>
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
              top={"30px"}
              right={"20px"}
            >
              <FormControl w={"3sm"}>
                <FormLabel>Resolved By</FormLabel>
                <Select
                  bg={"white"}
                  value={filterIt}
                  onChange={(e) => {
                    setFilterIt(e.target.value);
                  }}
                >
                  <option value="all">All</option>
                 { filterItUser.map((user) =>
                  (<option value={user.id}>{user.label}</option>))}

                </Select>
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
                <Select
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
                </Select>
              </FormControl>
              <FormControl w={"3sm"}>
                <FormLabel>Status</FormLabel>
                <Select
                  bg={"white"}
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                  }}
                >
                  <option value={"all"}>All</option>
                  <option value={"open"}>Open</option>
                  <option value={"close"}>Close</option>
                </Select>
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
                    <Td>
                      {request.type === "Incident"
                        ? ""
                        : request.itHeadApprovedAt
                        ? "L2 Approved"
                        : request.itHeadRejectedAt
                        ? "L2 Rejected"
                        : request.headApprovedAt
                        ? "L1 Approved"
                        : request.headRejectedAt
                        ? "L1 Rejected"
                        : "Waiting for L1 Approval"}
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
