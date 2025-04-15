import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  HStack,
  Text,
  useToast,
  IconButton,
  Box,
  Flex
} from "@chakra-ui/react";
import { Star } from "lucide-react";
import axios from "axios";

const apiIp = process.env.REACT_APP_API_IP;

const TicketFeedback = ({ isOpen, onClose, ticketId, ticketNumber, prevRating, prevFeedback, isDisabled }) => {
  const [rating, setRating] = useState(prevRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState(prevFeedback);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleMouseEnter = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const getRatingLabel = () => {
    const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    return rating > 0 ? labels[rating] : "Select rating";
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating before submitting feedback",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://${apiIp}/tickets/feedback`,
        {
          ticketId: ticketId,
          rating: rating,
          feedback: feedback.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setRating(0);
      setFeedback("");
      onClose();

    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast({
        title: "Submission failed",
        description: "Unable to submit your feedback. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="lg" shadow="xl">
        <ModalHeader borderBottomWidth="1px" py={4}>
          <Text>Rate your experience</Text>
          <Text fontSize="sm" fontWeight="normal" color="gray.500" mt={1}>
            Ticket #{ticketNumber}
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            <Box>
              <FormLabel mb={4}>How would you rate the resolution?</FormLabel>
              <Flex direction="column" align="center">
                <HStack spacing={2} mb={2}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton
                      key={star}
                      icon={
                        <Star
                          size={24}
                          fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                        />
                      }
                      variant="ghost"
                      colorScheme={(hoverRating || rating) >= star ? "yellow" : "gray"}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => handleMouseEnter(star)}
                      onMouseLeave={handleMouseLeave}
                      aria-label={`${star} stars`}
                      size="lg"
                    />
                  ))}
                </HStack>
                <Text fontWeight="medium" color={rating > 0 ? "blue.500" : "gray.500"}>
                  {getRatingLabel()}
                </Text>
              </Flex>
            </Box>

            <FormControl>
              <FormLabel>Additional comments (optional)</FormLabel>
              <Textarea
                placeholder="Tell us about your experience..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                size="md"
                borderRadius="md"
                rows={4}
                resize="vertical"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" py={4}>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={submitting}
            loadingText="Submitting"
            isDisabled={isDisabled}
          >
            Submit Feedback
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TicketFeedback;