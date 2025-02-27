import React, { useEffect, useState } from "react";
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
  Select,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, SlidersHorizontalIcon } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UserDetailsBox = ({ userDetails, onClose }) => (
  <Box
    position="absolute"
    top="20px"
    left="20px"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="md"
    bgColor="#f7fafc"
    p={4}
    boxShadow="md"
    zIndex="overlay"
  >
    <CloseButton position="absolute" top={2} right={2} onClick={onClose} />
    <Text fontWeight="bold" textAlign="center">
      User Details
    </Text>
    <Text>
      <Text as="span" fontWeight="bold">
        Name:
      </Text>{" "}
      {userDetails.name}
    </Text>
    <Text>
      <Text as="span" fontWeight="bold">
        Email:
      </Text>{" "}
      {userDetails.email}
    </Text>
    <Text>
      <Text as="span" fontWeight="bold">
        Employee Id:
      </Text>{" "}
      {userDetails.id}
    </Text>
    <Text>
      <Text as="span" fontWeight="bold">
        Contact No.:
      </Text>{" "}
      {userDetails.contact}
    </Text>
    <Text>
      <Text as="span" fontWeight="bold">
        Department:
      </Text>{" "}
      {userDetails.department}
    </Text>
    <Text>
      <Text as="span" fontWeight="bold">
        Reporting Manager:
      </Text>{" "}
      {userDetails.reportingTo}
    </Text>
    <Text>
      <Text as="span" fontWeight="bold">
        Role:
      </Text>{" "}
      {userDetails.role}
    </Text>

    {/* Add more user details as needed */}
  </Box>
);
const DashboardIt = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const apiIp = process.env.REACT_APP_API_IP;
  const [lists, setLists] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const pageSize = 50;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState(null);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const handleRowClick = (id, type) => {
    navigate(`/service-request-form-dept/${id}?type=${type}`);
  };
  const handleCreatedBy = async (createdById) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}:3000/user/info?id=${createdById}`,
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
    } finally {
      setLoading(false);
    }
  };
  const handleCloseUserDetails = () => {
    setUserDetails(null);
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}:3000/tickets/it?pageNumber=${currentPage}&pageSize=${pageSize}` +
          (filterDate ? `&date=${filterDate}` : "") +
          (filterType !== "all" ? `&type=${filterType}` : "") +
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

   useEffect(() => {
      let count = 0;
      if(filterDate)count++;
      if(filterStatus !== 'all')count++;
      if(filterType !== 'all') count++;
      setActiveFilterCount(count)
      fetchData();
    }, [currentPage, filterDate, filterType, filterStatus]);
  

  return (
    <Box p={6} position={"relative"} minH={"79vh"}>
       <Card pt={"20px"} minH={'75vh'}>
           <CardBody position="relative" >
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
                <FormLabel>Select Date</FormLabel>
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
                  <Th>Ticket No</Th>
                  <Th>Created On</Th>
                  <Th>Description</Th>
                  <Th>Created By</Th>
                  <Th>Status</Th>
                  <Th>Type</Th>
                  <Th>Action</Th>
                  <Th> Level of Approval</Th>
                  <Th>Remark by Approver</Th>
                  <Th>Resolved By</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lists.map((request) => (
                  <Tr key={request.id}>
                    <Td>{request.sequenceNo}</Td>
                    <Td>{request.createdAt}</Td>
                    <Td>{request.query}</Td>
                    <Td
                      cursor="pointer"
                      onClick={() => handleCreatedBy(request.createdById)}
                    >
                      {request.createdBy}
                    </Td>
                    <Td color={request.resolvedAt ? "red.500" : "green.500"}>
                      {request.resolvedAt ? "Close" : "Open"}
                    </Td>
                    <Td>{request.type}</Td>
                    <Td>
                      <Box display={"flex"} gap={2}>
                        <Button
                          onClick={() =>
                            handleRowClick(request.id, request.type)
                          }
                          // style={{ cursor: "pointer" }}
                          _hover={{ bg: "gray.50" }}
                          p={2}
                          color={"green.400"}
                        >
                          {request.resolvedBy ? "View" : "Resolve"}
                        </Button>
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
                    <td>{request.itHeadRemark}</td>
                    <td>{request.resolvedBy}</td>
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

      {userDetails && (
        <UserDetailsBox
          userDetails={userDetails}
          onClose={handleCloseUserDetails}
        />
      )}
    </Box>
  );
};

export default DashboardIt;
