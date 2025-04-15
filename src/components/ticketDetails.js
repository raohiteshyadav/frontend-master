import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Text,
    VStack,
    HStack,
    Badge,
    Box,
    Flex,
    Divider,
    Tooltip,
    useToast,
    Spinner,
    Textarea,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Tag,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    IconButton,
    useDisclosure
} from "@chakra-ui/react";
import {
    Calendar,
    Clock,
    User,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Send,
    PaperclipIcon,
    ExternalLink
} from "lucide-react";
import axios from "axios";
import TicketFeedback from "./ticketFeedback";

const apiIp = process.env.REACT_APP_API_IP;

const TicketDetails = ({ isOpen, onClose, ticketId }) => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [commentHistory, setCommentHistory] = useState([]);
    const { isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose } = useDisclosure();
    const toast = useToast();

    const fetchTicketDetails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://${apiIp}/tickets/${ticketId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTicket(response.data);

            // const commentsResponse = await axios.get(
            //     `http://${apiIp}/tickets/${ticketId}/comments`,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${token}`,
            //         },
            //     }
            // );
            // setCommentHistory(commentsResponse.data || []);
        } catch (err) {
            console.error("Error fetching ticket details:", err);
            toast({
                title: "Failed to load ticket details",
                description: "Please try again later",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && ticketId) {
            fetchTicketDetails();
        }
    }, [isOpen, ticketId]);

    const handleAddComment = async () => {
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `http://${apiIp}/tickets/${ticketId}/comments`,
                { content: comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchTicketDetails();
            setComment("");

            toast({
                title: "Comment added",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (err) {
            console.error("Error adding comment:", err);
            toast({
                title: "Failed to add comment",
                description: "Please try again later",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        if (status) return "green";
        return "red";
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch (error) {
            return dateString;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
                <ModalOverlay bg="blackAlpha.300" />
                <ModalContent borderRadius="lg" maxW="800px">
                    {loading ? (
                        <Box minH={'800px'} py={10} display="flex" justifyContent="center" alignItems="center">
                            <Spinner size="xl" color="blue.500" thickness="4px" />
                        </Box>
                    ) : ticket ? (
                        <>
                            <ModalHeader borderBottomWidth="1px" py={4}>
                                <Flex justify="space-between" align="center">
                                    <Box>
                                        <Heading size="md" mb={1}>Ticket #{ticket.sequenceNo}</Heading>
                                        <Badge
                                            colorScheme={ticket.type === "Incident" ? "red" : "blue"}
                                            variant="outline"
                                            px={2}
                                            py={1}
                                            mr={2}
                                        >
                                            {ticket.type}
                                        </Badge>
                                        <Badge
                                            colorScheme={getStatusColor(ticket.resolvedAt)}
                                            variant="subtle"
                                            px={2}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            {ticket.resolvedAt ? "Resolved" : "Open"}
                                        </Badge>
                                    </Box>
                                    <IconButton
                                        icon={<RefreshCw size={16} />}
                                        aria-label="Refresh ticket"
                                        mt={-10}
                                        mr={8}
                                        size="sm"
                                        variant="ghost"
                                        onClick={fetchTicketDetails}
                                    />
                                </Flex>
                            </ModalHeader>
                            <ModalCloseButton />

                            <ModalBody py={6}>
                                <VStack spacing={6} align="stretch">
                                    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                                        <GridItem>
                                            <Text fontWeight="semibold" color="gray.600" fontSize="sm">Created On</Text>
                                            <Flex align="center" mt={1}>
                                                <Calendar size={14} color="gray.400" style={{ marginRight: "6px" }} />
                                                <Text>{formatDate(ticket.createdAt)}</Text>
                                            </Flex>
                                        </GridItem>
                                        {ticket.resolvedAt && (
                                            <GridItem>
                                                <Text fontWeight="semibold" color="gray.600" fontSize="sm">Resolved On</Text>
                                                <Flex align="center" mt={1}>
                                                    <CheckCircle size={14} color="gray.400" style={{ marginRight: "6px" }} />
                                                    <Text>{formatDate(ticket.resolvedAt)}</Text>
                                                </Flex>
                                            </GridItem>
                                        )}
                                    </Grid>

                                    <Divider />

                                    <Box>
                                        <Text fontWeight="semibold" mb={2}>Description</Text>
                                        <Box
                                            p={4}
                                            bg="gray.50"
                                            borderRadius="md"
                                            whiteSpace="pre-wrap"
                                        >
                                            {ticket.query}
                                        </Box>
                                    </Box>

                                    {ticket.remark && (
                                        <Box>
                                            <Text fontWeight="semibold" mb={2}>Resolution</Text>
                                            <Box
                                                p={4}
                                                bg="green.50"
                                                borderRadius="md"
                                                whiteSpace="pre-wrap"
                                                borderLeft="4px solid"
                                                borderColor="green.500"
                                            >
                                                {ticket.remark}
                                            </Box>
                                        </Box>
                                    )}

                                    <Divider />

                                    <Box>
                                        <Text fontWeight="semibold" mb={3}>Comments & Updates</Text>
                                        <VStack spacing={4} align="stretch" maxH="300px" overflowY="auto" px={1}>
                                            {commentHistory.length > 0 ? (
                                                commentHistory.map((comment, index) => (
                                                    <Box
                                                        key={index}
                                                        p={3}
                                                        borderRadius="md"
                                                        bg={comment.isStaff ? "blue.50" : "gray.50"}
                                                        borderLeft="3px solid"
                                                        borderColor={comment.isStaff ? "blue.400" : "gray.300"}
                                                    >
                                                        <Flex justify="space-between" mb={1}>
                                                            <Text fontWeight="medium" fontSize="sm">
                                                                {comment.author}
                                                                {comment.isStaff && (
                                                                    <Badge ml={2} colorScheme="blue" variant="subtle" fontSize="xs">
                                                                        Staff
                                                                    </Badge>
                                                                )}
                                                            </Text>
                                                            <Text fontSize="xs" color="gray.500">
                                                                {formatDate(comment.createdAt)}
                                                            </Text>
                                                        </Flex>
                                                        <Text fontSize="sm">{comment.content}</Text>
                                                    </Box>
                                                ))
                                            ) : (
                                                <Box textAlign="center" py={4}>
                                                    <Text color="gray.500">No comments yet</Text>
                                                </Box>
                                            )}
                                        </VStack>
                                    </Box>

                                    {!ticket.resolvedAt && (
                                        <FormControl>
                                            <FormLabel fontWeight="semibold">Add Comment</FormLabel>
                                            <Textarea
                                                placeholder="Type your comment here..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                rows={3}
                                                resize="vertical"
                                            />
                                            <Flex justifyContent="flex-end" mt={2}>
                                                <Button
                                                    colorScheme="blue"
                                                    size="sm"
                                                    leftIcon={<Send size={14} />}
                                                    onClick={handleAddComment}
                                                    isLoading={submitting}
                                                    // isDisabled={!comment.trim()}
                                                    isDisabled
                                                >
                                                    Send
                                                </Button>
                                            </Flex>
                                        </FormControl>
                                    )}

                                    {ticket.attachmentId && (
                                        <Accordion allowToggle>
                                            <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="md">
                                                <h2>
                                                    <AccordionButton py={3}>
                                                        <Box flex="1" textAlign="left" fontWeight="semibold">
                                                            <Flex align="center">
                                                                <PaperclipIcon size={16} style={{ marginRight: "8px" }} />
                                                                Attachments (1)
                                                            </Flex>
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    <VStack align="stretch" spacing={2}>
                                                        {/* {ticket.attachments.map((attachment, index) => ( */}
                                                        <Flex
                                                            key={'attachment-1'}
                                                            p={2}
                                                            borderRadius="md"
                                                            bg="gray.50"
                                                            justify="space-between"
                                                            align="center"
                                                        >
                                                            <Text fontSize="sm" isTruncated maxW="70%">
                                                                {ticket.attachmentId}
                                                            </Text>
                                                            <Button
                                                                size="xs"
                                                                rightIcon={<ExternalLink size={12} />}
                                                                variant="ghost"
                                                                as="a"
                                                                href={`media-preview/${ticket.attachmentId}`}
                                                                target="_blank"
                                                            >
                                                                Download
                                                            </Button>
                                                        </Flex>
                                                        {/* ))} */}
                                                    </VStack>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        </Accordion>
                                    )}
                                </VStack>
                            </ModalBody>

                            <ModalFooter borderTopWidth="1px" py={4}>
                                <Button variant="outline" mr={3} onClick={onClose}>
                                    Close
                                </Button>
                                {ticket.resolvedAt && (
                                    <Button
                                        colorScheme="blue"
                                        leftIcon={<MessageSquare size={16} />}
                                        onClick={onFeedbackOpen}
                                    >
                                        Give Feedback
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    ) : (
                        <Box py={10} textAlign="center">
                            <AlertTriangle size={40} style={{ margin: "0 auto 16px auto" }} />
                            <Text>Ticket not found or error loading details</Text>
                            <Button mt={4} onClick={onClose}>Close</Button>
                        </Box>
                    )}
                </ModalContent>
            </Modal>

            {ticket && (
                <TicketFeedback
                    isOpen={isFeedbackOpen}
                    onClose={onFeedbackClose}
                    ticketId={ticket.id}
                    prevFeedback={null}
                    prevRating={0}
                    ticketNumber={ticket.sequenceNo}
                />
            )}
        </>
    );
};

export default TicketDetails;