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
  Flex,
  HStack,
  VStack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Divider,
  Image,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Stack,
  Tooltip
} from "@chakra-ui/react";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  MessageSquare,
  RefreshCw,
  MoreVertical,
  Calendar,
  Eye,
  MessageSquareHeartIcon,
  NotebookIcon,
  MailCheckIcon,
  Scale
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../providers/authProvider";
import { UserProfile } from "./userProfile";
import IncidentRequestForm from "./IncidentRequestForm";
import ServiceRequestForm from "./ServiceRequestForm";
import TicketFeedback from "./ticketFeedback";
import { isNull } from "lodash";
import TicketDetails from "./ticketDetails";

const apiIp = process.env.REACT_APP_API_IP;

const Raise = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [activeTab, setActiveTab] = useState(0);
  const [selectedTab, setSelectedTab] = useState();
  const [feedbackTicket, setFeedbackTicket] = useState(null);
  const [viewTicket, setViewTicket] = useState(null);

  const user = useAuth();

  const borderColor = useColorModeValue("gray.200", "gray.700");

  const openFeedbackModal = (ticket) => {
    setFeedbackTicket(ticket);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}/tickets/list?pageNumber=${currentPage}&pageSize=${pageSize}`,
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
      toast({
        title: "Failed to load ticket data",
        description: "Please check your connection and try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshTickets = () => {
    fetchData();
  }

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (["service-form", "incident-form"].includes(currentTab)) {
      setSelectedTab(currentTab);
    } else {
      setSelectedTab("home");
      fetchData();
    }
  }, [searchParams]);

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (selectedTab && selectedTab !== currentTab) {
      const params = new URLSearchParams(searchParams);
      params.set("tab", selectedTab);
      setSearchParams(params, { replace: true });
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const getStatusColor = (status) => {
    if (status) return "green";
    return "red";
  };

  const scrollToMainContent = (offset = 200) => {
    const element = document.getElementById('main-content');
    const bodyTop = document.body.getBoundingClientRect().top;
    const elementTop = element.getBoundingClientRect().top;
    const scrollTo = elementTop - bodyTop - offset;

    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
  };

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

            <Card
              mt={6}
              shadow="sm"
              borderRadius="lg"
              overflow="hidden"
            >
              <CardBody p={0}>
                <VStack spacing={0} divider={<Divider />} align="stretch">
                  <Box p={4} bg="gray.50">
                    <Heading size="sm" fontWeight="semibold">Quick Actions</Heading>
                  </Box>

                  <Button
                    justifyContent="flex-start"
                    leftIcon={<AlertTriangle size={16} />}
                    colorScheme="red"
                    variant="ghost"
                    borderRadius={0}
                    h="50px"
                    onClick={() => { setSelectedTab('incident-form'); scrollToMainContent(); }}
                  >
                    Report Incident
                  </Button>

                  <Button
                    justifyContent="flex-start"
                    leftIcon={<MessageSquare size={16} />}
                    colorScheme="blue"
                    variant="ghost"
                    borderRadius={0}
                    h="50px"
                    onClick={() => { setSelectedTab('service-form'); scrollToMainContent(); }}
                  >
                    Service Request
                  </Button>

                  <Button
                    justifyContent="flex-start"
                    leftIcon={<Eye size={16} />}
                    variant="ghost"
                    colorScheme="green"
                    borderRadius={0}
                    h="50px"
                    onClick={() => { setSelectedTab('home'); scrollToMainContent(400); }}
                  >
                    View My Tickets
                  </Button>
                  <Button
                    justifyContent="flex-start"
                    leftIcon={<Scale size={16} />}
                    variant="ghost"
                    borderRadius={0}
                    h="50px"
                    disabled={true}
                    onClick={() => { }}
                  >
                    IT Guidelines
                  </Button>
                  <Button
                    justifyContent="flex-start"
                    leftIcon={<NotebookIcon size={16} />}
                    variant="ghost"
                    borderRadius={0}
                    h="50px"
                    disabled={true}
                    onClick={() => { }}
                  >
                    User Manual
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card display={{ base: 'none', md: 'flex' }} mt={6} shadow="sm" borderRadius="lg" bg="blue.700" color="white">
              <CardBody p={5}>
                <VStack spacing={3} align="start">
                  <Heading size="sm">Need Help?</Heading>
                  <Text fontSize="sm">
                    Our support team is available 24/7 to assist you with any issues or questions.
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="whiteAlpha"
                    rightIcon={<MailCheckIcon size={14} />}
                    onClick={() => window.location.href = "mailto:rishi.prasad@rashmigroup.com"}
                  >
                    Contact Support
                  </Button>
                </VStack>
              </CardBody>
            </Card>
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
                right="-20px"
                top="-20px"
                opacity={0.1}
                transform="rotate(15deg)"
              >
                <AlertTriangle size={150} />
              </Box>
              <VStack align="start" spacing={2} position="relative" zIndex={1}>
                <Heading size="lg">IT Support Portal</Heading>
                <Text>Create and manage your support requests</Text>
              </VStack>
            </Box>

            {selectedTab === 'home' && <Stack direction={{ base: "column", md: "row" }} mb={6} spacing={5}>
              <Card
                flex={1}
                p={5}
                shadow="sm"
                borderRadius="lg"
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => { setSelectedTab('incident-form'); scrollToMainContent(); }}
                borderLeft="4px solid"
                borderColor="red.500"
              >
                <Flex align="center">
                  <Box
                    p={3}
                    borderRadius="full"
                    bg="red.100"
                    color="red.500"
                    mr={3}
                  >
                    <AlertTriangle size={18} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">Incident Request</Text>
                    <Text fontSize="sm" color="gray.500">I have an Issue...</Text>
                  </VStack>
                </Flex>
              </Card>

              <Card
                flex={1}
                p={5}
                shadow="sm"
                borderRadius="lg"
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => { setSelectedTab('service-form'); scrollToMainContent(); }}
                borderLeft="4px solid"
                borderColor="blue.500"
              >
                <Flex align="center">
                  <Box
                    p={3}
                    borderRadius="full"
                    bg="blue.100"
                    color="blue.500"
                    mr={3}
                  >
                    <MessageSquare size={18} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">Service Request</Text>
                    <Text fontSize="sm" color="gray.500">I need something...</Text>
                  </VStack>
                </Flex>
              </Card>
            </Stack>}

            <Card shadow="sm" borderRadius="lg" w="auto">
              <CardBody id="main-content" p={0}>
                <Button
                  position={'absolute'}
                  right={7}
                  top={7}
                  leftIcon={<ChevronLeft size={16} />}
                  size="sm"
                  zIndex={9}
                  variant="outline"
                  display={selectedTab === 'home' ? 'none' : 'flex'}
                  onClick={() => { setSelectedTab("home"); scrollToMainContent(400); }}
                >
                  Back
                </Button>
                {selectedTab === 'home' && <Tabs colorScheme="blue" size="md">
                  <TabList borderBottomColor={borderColor} flexWrap="wrap">
                    <Tab py={4} fontWeight="medium">All</Tab>
                    <Tab py={4} fontWeight="medium">Open</Tab>
                    <Tab py={4} fontWeight="medium">Resolved</Tab>

                    <Flex display={{ base: 'none', md: 'flex' }} ml={{ base: 0, md: "auto" }} align="center" pr={4} wrap="wrap">
                      <IconButton
                        icon={<RefreshCw size={16} />}
                        size="sm"
                        variant="ghost"
                        isLoading={loading}
                        aria-label="Refresh"
                        onClick={fetchData}
                        mr={2}
                      />
                    </Flex>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0}>
                      <Box position={'relative'}>
                        <Box overflow={'auto'}>
                          <Table variant="simple" width={"100%"} overflowY={'auto'}>
                            <Thead bg="gray.50">
                              <Tr>
                                <Th>Ticket No.</Th>
                                <Th>Description</Th>
                                <Th>Status</Th>
                                <Th>Type</Th>
                                <Th minWidth="148px">Date</Th>
                                <Th>More</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {lists.length > 0 ? (
                                lists.map((request) => (
                                  <Tr key={request.id} >
                                    <Td fontWeight="medium" color="blue.600" _hover={{ textDecor: 'underline', cursor: 'pointer' }} onClick={() => setViewTicket(request.id)}>
                                      {request.sequenceNo}
                                    </Td>
                                    <Tooltip hasArrow label={<Text whiteSpace="pre-wrap">{request.query}</Text>}>
                                      <Td cursor={"pointer"} maxW="200px" isTruncated>{request.query}</Td>
                                    </Tooltip>
                                    <Td>
                                      <Badge colorScheme={getStatusColor(request.resolvedAt)} display={'flex'} justifyContent={'center'} alignItems={'center'} minW={'75px'} variant="subtle" px={2} py={1} borderRadius="full">
                                        {request.resolvedAt ? "Resolved" : "Open"}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <Badge colorScheme={request.type === "Incident" ? "red" : "blue"} display={'flex'} justifyContent={'center'} alignItems={'center'} minW={'73px'} variant="outline" px={2} py={1}>
                                        {request.type}
                                      </Badge>
                                    </Td>
                                    <Td fontSize="sm" color="gray.600">
                                      <Flex align="center">
                                        <Calendar size={14} style={{ marginRight: "6px" }} />
                                        {request.createdAt}
                                      </Flex>
                                    </Td>
                                    <Td >
                                      <Menu >
                                        <MenuButton as={IconButton} aria-label="Options" icon={<MoreVertical size={16} />} variant="ghost" size="sm" />
                                        <MenuList>
                                          <MenuItem onClick={() => setViewTicket(request.id)} icon={<Eye size={16} />}>View Details</MenuItem>
                                          <MenuItem isDisabled={isNull(request.resolvedAt)} icon={<MessageSquareHeartIcon size={16} />} onClick={() => openFeedbackModal(request)}>Feedback</MenuItem>
                                        </MenuList>
                                      </Menu>
                                    </Td>
                                  </Tr>
                                ))
                              ) : (
                                <Tr>
                                  <Td colSpan={6} py={6} textAlign="center">
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
                              )}
                            </Tbody>
                          </Table>
                        </Box>
                        <Flex justifyContent="space-between" align="center" p={4} borderTop="1px solid" borderColor={borderColor} bg="gray.50" wrap="wrap">
                          <Text display={{ base: "none", md: "flex" }} fontSize="sm" color="gray.600">
                            Showing {(currentPage - 1) * pageSize + 1} to {(currentPage - 1) * pageSize + lists.length} tickets
                          </Text>
                          <HStack w={{ base: "full", md: 'auto' }} justifyContent={{ base: "space-between", md: "auto" }}>
                            <IconButton icon={<ChevronLeft size={16} />} isDisabled={loading || currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} size="sm" aria-label="Previous page" />
                            <Text fontSize="sm" fontWeight="medium" px={2}>{currentPage} / {totalPages}</Text>
                            <IconButton icon={<ChevronRight size={16} />} isDisabled={loading || currentPage >= totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} size="sm" aria-label="Next page" />
                          </HStack>
                        </Flex>
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box py={10} textAlign="center">
                        <Text color="gray.500">Open tickets will be displayed here</Text>
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box py={10} textAlign="center">
                        <Text color="gray.500">Resolved tickets will be displayed here</Text>
                      </Box>
                    </TabPanel>
                  </TabPanels>
                </Tabs>}
                {selectedTab === 'incident-form' && <IncidentRequestForm />}
                {selectedTab === 'service-form' && <ServiceRequestForm />}
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </Box >
      {/* Ticket Details Modal */}
      < TicketDetails
        isOpen={!!viewTicket}
        onClose={() => setViewTicket(null)}
        ticketId={viewTicket}
        refreshTickets={refreshTickets}
      />
      {/* Feedback Modal */}
      {
        feedbackTicket && (
          <TicketFeedback
            isOpen={!!feedbackTicket}
            onClose={() => setFeedbackTicket(null)}
            ticketId={feedbackTicket.id}
            ticketNumber={feedbackTicket.sequenceNo}
            prevFeedback={feedbackTicket.feedback || null}
            prevRating={feedbackTicket.rating || null}
            refreshTickets={refreshTickets}
            isDisabled={isNull(feedbackTicket.resolvedAt)}
          />
        )
      }
    </Box >
  );
};

export default Raise;