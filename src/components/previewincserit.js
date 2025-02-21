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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MediaPreview from "./mediaPreview";

const apiIp = process.env.REACT_APP_API_IP;

const PreviewIncSerIt = () => {
  const [searchParams, setSearchParams]= useSearchParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Form state
  const [type, setType] = useState(searchParams.get("type"));
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
    (async () => {
      if (id) {
        const token = localStorage.getItem("token");
        try {
          const ticketResponse = await axios.get(
            `http://${apiIp}:3000/tickets/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const ticketData = ticketResponse.data;

          // setType(ticketData.type);
          setDescription(ticketData.query);
          setSeverity(ticketData.priority);
          setAttachmentId(ticketData.attachmentId);
          setFileName(ticketData.attachmentName);
          setApproved(ticketData.itApprovedAt);
          setRemark(ticketData.remark);
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
    })();
  }, [id, toast]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading((prev) => ({ ...prev, categories: true }));
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://${apiIp}:3000/tickets/drop/category?type=${type}`,
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
  }, [category , categories]);

  // Fetch items when subcategory changes
// In the useEffect for fetching items
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
      setItems([]); // Clear items if no subcategory is selected.
    }
  };

  fetchItems();
}, [subcategory, subcategories]); // Make sure to trigger when `subcategory` or `subcategories` change


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
      type,
      attachmentId: attachmentId || undefined,
      remark: remark,
      request: "resolved",
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
        navigate("/home");
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
            {type} Request Details
          </Heading>
         { type === "Incident" && <Badge
            colorScheme={severity === "High" ? "red" : "orange"}
            p={1}
            borderRadius={"md"}
            ml={2}
            fontSize="md"
          >
            {severity}
          </Badge>}
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
                >
                  <option value="">
                    { "Select a subcategory"}
                  </option>
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
                >
                  <option value="">{"Select a Item"}</option>
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

            <Flex w="full" justify="flex-end" mt={4}>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => handleSubmit("approved")}
                isDisabled={!remark}
                _hover={{ transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                Resolve Request
              </Button>
            </Flex>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default PreviewIncSerIt;
