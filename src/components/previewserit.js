import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Button,
  useToast,
  Container,
  Card,
  CardBody,
  CardHeader,
  Text,
  Divider,
  Badge,
  Flex,
  Skeleton,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import MediaPreview from "./mediaPreview";

const apiIp = process.env.REACT_APP_API_IP;

const PreviewSerIt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Form state
  const [type, setType] = useState("Service");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [item, setItem] = useState("");
  const [attachmentId, setAttachmentId] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [approved, setApproved] = useState("");
  const [remark, setRemark] = useState("");

  // States for fetched data
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState({
    categories: false,
    subcategories: false,
    items: false,
  });

  // Fetch ticket details and initial data
  useEffect(() => {
    const fetchTicket = async () => {
      if (id) {
        const token = localStorage.getItem("token");
        try {
          // Fetch ticket details
          const ticketResponse = await axios.get(
            `http://${apiIp}:3000/tickets/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const ticketData = ticketResponse.data;

          setDescription(ticketData.query);
          setSeverity(ticketData.priority);
          setAttachmentId(ticketData.attachmentId);
          setFileName(ticketData.attachmentName);
          setApproved(ticketData.itApprovedAt);
          setRemark(ticketData.itHeadRemark || ticketData.remark || "");
          setType(ticketData.type);
          // Set the category, subcategory, and item for later use
          setCategory(ticketData.category);
          setSubcategory(ticketData.subCategory);
          setItem(ticketData.item);
        } catch (error) {
          console.error("Error fetching ticket data:", error);
          toast({
            title: "Error fetching ticket data",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };
    fetchTicket();
  }, [id, toast]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading((prev) => ({ ...prev, categories: true }));
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://${apiIp}:3000/tickets/drop/category?type=Service`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data || []);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error fetching categories",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };

    fetchCategories();
  }, [toast]);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (category) {
        setLoading((prev) => ({ ...prev, subcategories: true }));
        const token = localStorage.getItem("token");

        try {
          const categoryObj = categories?.find((cat) => cat.label === category);
          if (categoryObj) {
            const response = await axios.get(
              `http://${apiIp}:3000/tickets/drop/sub-category?id=${categoryObj.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setSubcategories(response.data || []);
          }
        } catch (error) {
          console.error(error);
          toast({
            title: "Error fetching subcategories",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading((prev) => ({ ...prev, subcategories: false }));
        }
      }
    };

    fetchSubcategories();
  }, [category, categories, toast]);

  // Fetch items when subcategory changes
  useEffect(() => {
    const fetchItems = async () => {
      if (subcategory) {
        setLoading((prev) => ({ ...prev, items: true }));
        const token = localStorage.getItem("token");

        try {
          const subcategoryObj = subcategories?.find(
            (subcat) => subcat.label === subcategory
          );
          if (subcategoryObj) {
            const response = await axios.get(
              `http://${apiIp}:3000/tickets/drop/item?id=${subcategoryObj.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.data) {
              setItems(response.data || []);
            } else {
              setItems([]);
            }
          }
        } catch (error) {
          console.error(error);
          toast({
            title: "Error fetching items",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading((prev) => ({ ...prev, items: false }));
        }
      } else {
        setItems([]);
      }
    };

    fetchItems();
  }, [subcategory, subcategories, toast]);

  const handleSubmit = (action) => {
    if (!category || !subcategory || !item) {
      toast({
        title: "Validation Error",
        description: "Please ensure all fields are properly loaded",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      query: description,
      priority: severity,
      category: category,
      subCategory: subcategory,
      item: item,
      type: "Service",
      attachmentId: attachmentId || undefined,
      remark: remark,
      request: "approved",
      action,
    };

    const token = localStorage.getItem("token");
    axios
      .post(`http://${apiIp}:3000/tickets/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast({
          title: "Success",
          description: `Ticket ${
            action === "approved"
              ? "Approved"
              : action === "rejected"
              ? "Rejected"
              : "Resolved"
          } Successfully!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: `Error ${
            action === "approved"
              ? "approving"
              : action === "rejected"
              ? "rejecting"
              : "resolving"
          } ticket`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Container maxW="container.md" py={8}>
      <Card variant="outline" shadow="lg">
        <CardHeader borderBottom={"1px solid gray"}>
          <Heading size="lg" textAlign="center" color="blue.600">
            Service Request Details
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>
                Category{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Skeleton isLoaded={!loading.categories}>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  bg="gray.50"
                  isDisabled={approved}
                >
                  <option value="">{"Select a category"}</option>
                  {categories?.map((item) => (
                    <option value={item.label} key={item.id}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Skeleton>
            </FormControl>

            <FormControl>
              <FormLabel>
                Subcategory{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Skeleton isLoaded={!loading.subcategories}>
                <Select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  bg="gray.50"
                  isDisabled={approved}
                >
                  <option value="">{"Select a subcategory"}</option>
                  {subcategories?.map((item) => (
                    <option value={item.label} key={item.id}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Skeleton>
            </FormControl>

            <FormControl>
              <FormLabel>
                Item{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Skeleton isLoaded={!loading.items}>
                <Select
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  bg="gray.50"
                  isDisabled={approved}
                >
                  <option value="">{"Select an Item"}</option>
                  {items?.map((item) => (
                    <option value={item.label} key={item.id}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Skeleton>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                isReadOnly
                bg="gray.50"
                minH="120px"
              />
            </FormControl>

            {attachmentId && (
              <Box w="full">
                <Divider my={4} />
                <Text mb={2} fontWeight="medium">
                  Attachment
                </Text>
                <MediaPreview mediaId={attachmentId} />
              </Box>
            )}

            <FormControl>
              <FormLabel>
                Remark{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Textarea
                placeholder="Enter your remarks here..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                minH="120px"
              />
            </FormControl>

            <Flex w="full" justify="space-between" mt={4}>
              {!approved && (
                <>
                  <Button
                    colorScheme="green"
                    size="lg"
                    onClick={() => handleSubmit("approved")}
                    isDisabled={!remark}
                    _hover={{ transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  >
                    Approve
                  </Button>
                  <Button
                    colorScheme="red"
                    size="lg"
                    onClick={() => handleSubmit("rejected")}
                    isDisabled={!remark}
                    _hover={{ transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  >
                    Reject
                  </Button>
                </>
              )}
              {approved && (
                <Text color="green.500" fontWeight="bold">
                  This ticket has already been approved.
                </Text>
              )}
            </Flex>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default PreviewSerIt;
