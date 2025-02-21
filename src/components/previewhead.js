import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MediaPreview from "./mediaPreview";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Text,
  Textarea,
  Button,
  VStack,
  HStack,
  Tooltip,
  Badge,
  CardHeader,
  Card
} from "@chakra-ui/react";

const apiIp = process.env.REACT_APP_API_IP;

const PreviewHead = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [item, setItem] = useState("");
  const [attachmentId, setAttachmentId] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [approved, setApproved] = useState(null);
  const [rejected, setRejected] = useState(null);

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("token");
      axios
        .get(`http://${apiIp}:3000/tickets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          setDescription(data.query);
          setSeverity(data.priority);
          setCategory(data.category);
          setSubcategory(data.subCategory);
          setItem(data.item);
          setAttachmentId(data.attachmentId);
          setFileName(data.attachmentName);
          setApproved(data.approvedByHeadAt);
          setRejected(data.rejectedByHeadAt);
        })
        .catch((error) => {
          console.error("Error fetching prefilled data:", error);
          toast.error("Error fetching data for prefill");
        });
    }
  }, [id]);

  const handleSubmit = (action) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://${apiIp}:3000/tickets/approve-head/${id}`,
        { query: description, action },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Ticket Approved/Rejected Successfully!!");
        setApproved(action === "approved" ? "approved" : "rejected");
        navigate("/approval");
      })
      .catch((error) => console.error(error));
  };

  const ReadOnlyField = ({ label, value }) => (
    <FormControl mb={5}>
      <FormLabel>{label}</FormLabel>
      <Box
        p={2}
        bg="gray.100"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
      >
        {value}
      </Box>
    </FormControl>
  );

  return (
    <Container  maxW="container.md" py={8}>
      <Card variant="outline" shadow="lg" p={2}>
        <VStack spacing={4} align="stretch">
          <CardHeader borderBottom={"1px solid gray"}>
            <Heading size="lg" textAlign="center" color="blue.600">
              Service Request Details
            </Heading>
          </CardHeader>

          <ReadOnlyField label="Category" value={category} />
          <ReadOnlyField label="Subcategory" value={subcategory} />
          <ReadOnlyField label="Item" value={item} />

          <FormControl mb={5}>
            <FormLabel>
              Description{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minH="120px"
              resize="vertical"
            />
          </FormControl>

          {attachmentId && (
            <Box py={2}>
              <MediaPreview mediaId={attachmentId} />
            </Box>
          )}

          <HStack spacing={4} justify="space-between" mt={4}>
            <Tooltip
              label={
                approved
                  ? `Approved on: ${new Date(approved).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" }
                    )} ${new Date(approved).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}`
                  : "Approve ticket"
              }
              hasArrow
              placement="top"
            >
              <Button
                colorScheme="blue"
                isDisabled={approved}
                onClick={() => handleSubmit("approved")}
                width="full"
              >
                Approve
              </Button>
            </Tooltip>

            <Tooltip
              label={
                rejected
                  ? `Rejected on: ${new Date(rejected).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" }
                    )} ${new Date(rejected).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}`
                  : "Reject ticket"
              }
              hasArrow
              placement="top"
            >
              <Button
                colorScheme="red"
                isDisabled={rejected}
                onClick={() => handleSubmit("rejected")}
                width="full"
              >
                Reject
              </Button>
            </Tooltip>
          </HStack>
        </VStack>
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick
      />
    </Container>
  );
};

export default PreviewHead;
