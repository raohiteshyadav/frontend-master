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
    Badge,
    Box,
    Flex,
    Divider,
    Tooltip,
    useToast,
    Spinner,
    Textarea,
    FormControl,
    Grid,
    GridItem,
    Heading,
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
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Send,
    PaperclipIcon,
    ExternalLink,
    Edit2Icon,
    Save,
    Maximize,
    Minimize
} from "lucide-react";
import axios from "axios";
import TicketFeedback from "./ticketFeedback";
import { isNil } from "lodash";

const apiIp = process.env.REACT_APP_API_IP;

const TicketDetails = ({ isOpen, onClose, ticketId, showFeedbackButton = true, refreshTickets = () => { console.log('Refresh function not passed to TicketDetails.') } }) => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submittingDescription, setSubmittingDescription] = useState(false);
    const [commentHistory, setCommentHistory] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editedDescription, setEditedDescription] = useState("");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const { isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose } = useDisclosure();
    const toast = useToast();

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const handleEditDescription = () => {
        setEditedDescription(ticket.query);
        setEditMode(true);
    };

    const cancelEdit = () => {
        setEditMode(false);
        setEditedDescription("");
    };

    const saveDescription = async () => {
        if (isNil(editedDescription?.trim())) {
            toast({
                title: "Description cannot be empty",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        setSubmittingDescription(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `http://${apiIp}/tickets/edit/query`,
                { query: editedDescription, ticketId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update local state for immediate UI update
            setTicket(prevTicket => ({
                ...prevTicket,
                query: editedDescription
            }));

            fetchTicketDetails();
            refreshTickets();
            setEditMode(false);

            toast({
                title: "Description updated successfully",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: "Failed to edit description",
                description: "Please try again later",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setSubmittingDescription(false);
        }
    };

    const fetchTicketDetails = async () => {
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

            const commentsResponse = await axios.get(
                `http://${apiIp}/tickets/comment/all/${ticketId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCommentHistory(commentsResponse.data || []);
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
            setEditMode(false);
            setEditedDescription("");
            setIsFullScreen(false);
            fetchTicketDetails();
        }
    }, [isOpen, ticketId]);

    const handleAddComment = async () => {
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `http://${apiIp}/tickets/comment/new/${ticketId}`,
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
            <Modal 
                isOpen={isOpen} 
                onClose={onClose} 
                size={isFullScreen ? "full" : "xl"} 
                scrollBehavior="inside"
            >
                <ModalOverlay bg="blackAlpha.300" />
                <ModalContent 
                    borderRadius={isFullScreen ? "0" : "lg"} 
                    maxW={isFullScreen ? "100%" : "800px"}
                    h={isFullScreen ? "100vh" : "auto"}
                >
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
                                    <Flex position={'absolute'} top={2} right={12}>
                                        <Tooltip label={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}>
                                            <IconButton
                                                icon={isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
                                                aria-label={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                                                size="sm"
                                                variant="ghost"
                                                onClick={toggleFullScreen}
                                                mr={2}
                                            />
                                        </Tooltip>
                                        <IconButton
                                            icon={<RefreshCw size={16} />}
                                            aria-label="Refresh ticket"
                                            size="sm"
                                            variant="ghost"
                                            onClick={fetchTicketDetails}
                                        />
                                    </Flex>
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
                                        <Flex justify="space-between" align="center" mb={2}>
                                            <Text fontWeight="semibold">Description</Text>
                                            {!editMode && !ticket.resolvedAt && (
                                                <Tooltip label="Edit description" placement="top">
                                                    <IconButton
                                                        size="sm"
                                                        icon={<Edit2Icon size={14} />}
                                                        variant="ghost"
                                                        onClick={handleEditDescription}
                                                        aria-label="Edit description"
                                                    />
                                                </Tooltip>
                                            )}
                                        </Flex>

                                        {editMode ? (
                                            <Box position="relative" transition="all 0.2s">
                                                <Textarea
                                                    value={editedDescription}
                                                    onChange={(e) => setEditedDescription(e.target.value)}
                                                    p={4}
                                                    bg="blue.50"
                                                    borderRadius="md"
                                                    rows={6}
                                                    resize="vertical"
                                                    borderColor="blue.200"
                                                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #63B3ED" }}
                                                    transition="all 0.2s"
                                                />
                                                <Flex mt={2} justify="flex-end" gap={2}>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={cancelEdit}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        colorScheme="blue"
                                                        leftIcon={<Save size={14} />}
                                                        onClick={saveDescription}
                                                        isLoading={submittingDescription}
                                                        loadingText="Saving..."
                                                    >
                                                        Save
                                                    </Button>
                                                </Flex>
                                            </Box>
                                        ) : (
                                            <Box
                                                p={4}
                                                bg="gray.50"
                                                borderRadius="md"
                                                whiteSpace="pre-wrap"
                                                position="relative"
                                                transition="all 0.2s"
                                            >
                                                {ticket.query}
                                            </Box>
                                        )}
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
                                        <Text fontWeight="semibold" mb={3}>Ticket Updates</Text>
                                        <VStack 
                                            spacing={4} 
                                            align="stretch" 
                                            overflowY="auto" 
                                            px={1}
                                        >
                                            {commentHistory.length > 0 ? (
                                                commentHistory.map((comment, index) => (
                                                    <Flex
                                                        key={index}
                                                        justify={comment.isIT ? 'flex-start' : 'flex-end'}
                                                    >
                                                        <Box
                                                            maxW="80%"
                                                            p={3}
                                                            borderRadius="md"
                                                            bg={comment.isStaff ? "blue.50" : "gray.50"}
                                                            borderLeft="3px solid"
                                                            borderColor={comment.isIT ? "blue.400" : "gray.300"}
                                                        >
                                                            <Flex justify="space-between" gap={2} mb={1}>
                                                                <Text fontWeight="medium" fontSize="sm">
                                                                    {comment.author}
                                                                    {comment.isIT && (
                                                                        <Badge ml={2} colorScheme="blue" variant="subtle" fontSize="xs">
                                                                            IT
                                                                        </Badge>
                                                                    )}
                                                                </Text>
                                                                <Text fontSize="xs" color="gray.500">
                                                                    {formatDate(comment.createdAt)}
                                                                </Text>
                                                            </Flex>
                                                            <Text fontSize="sm">{comment.content}</Text>
                                                        </Box>
                                                    </Flex>
                                                ))
                                            )
                                                : (
                                                    <Box textAlign="center" py={4}>
                                                        <Text color="gray.500">No conversation Found.</Text>
                                                    </Box>
                                                )}
                                        </VStack>
                                    </Box>

                                    {!ticket.resolvedAt && (
                                        <FormControl display={'flex'} gap={2} mb={4}>
                                            <Textarea
                                                placeholder="Type your comment here..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                rows={1}
                                                resize="vertical"
                                            />
                                            <Flex justifyContent="flex-end" >
                                                <Tooltip label='Send'>
                                                    <Button
                                                        colorScheme="blue"
                                                        size="md"
                                                        p={1}
                                                        onClick={handleAddComment}
                                                        isLoading={submitting}
                                                        isDisabled={comment.trim() === ""}
                                                    >
                                                        <Send size={16} style={{ margin: 'auto' }} />
                                                    </Button>
                                                </Tooltip>
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
                                                        <Flex
                                                            key={'attachment-1'}
                                                            p={2}
                                                            borderRadius="md"
                                                            bg="gray.50"
                                                            justify="space-between"
                                                            align="center"
                                                        >
                                                            <Text fontSize="sm" isTruncated maxW="70%">
                                                                Media file {ticket.attachmentId}
                                                            </Text>
                                                            <Button
                                                                size="xs"
                                                                rightIcon={<ExternalLink size={12} />}
                                                                variant="ghost"
                                                                as="a"
                                                                href={`media-preview/${ticket.attachmentId}`}
                                                                target="_blank"
                                                            >
                                                                View
                                                            </Button>
                                                        </Flex>
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
                                {showFeedbackButton && ticket.resolvedAt && (
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
                    prevFeedback={ticket.feedback || null}
                    prevRating={ticket.rating || null}
                    ticketNumber={ticket.sequenceNo}
                    refreshTickets={refreshTickets}
                />
            )}
        </>
    );
};

export default TicketDetails;