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
  HStack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import MediaUploader from "./mediaUploader";
import MediaPreview from "./mediaPreview";

const apiIp = process.env.REACT_APP_API_IP;

const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Form state
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("High");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [item, setItem] = useState("");
  const [attachmentId, setAttachmentId] = useState(null);
  const [fileName, setFileName] = useState(null);

  // States for fetched data
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState({
    categories: false,
    subcategories: false,
    items: false,
  });
   const headingColor = useColorModeValue("teal.600", "teal.200");

  // Fetch categories on component mount
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
        setCategories(response.data);
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
        // Reset subcategory and item when category changes
        setSubcategory("");
        setItem("");
        setItems([]); // Clear items list

        const token = localStorage.getItem("token");

        try {
          const response = await axios.get(
            `http://${apiIp}:3000/tickets/drop/sub-category?id=${category}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSubcategories(response.data);
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
      } else {
        // Clear dependent fields if category is cleared
        setSubcategories([]);
        setSubcategory("");
        setItems([]);
        setItem("");
      }
    };

    fetchSubcategories();
  }, [category, toast]);

  // Fetch items when subcategory changes
  useEffect(() => {
    const fetchItems = async () => {
      if (subcategory) {
        setLoading((prev) => ({ ...prev, items: true }));
        // Reset item when subcategory changes
        setItem("");

        const token = localStorage.getItem("token");

        try {
          const response = await axios.get(
            `http://${apiIp}:3000/tickets/drop/item?id=${subcategory}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setItems(response.data);
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
        // Clear items if subcategory is cleared
        setItems([]);
        setItem("");
      }
    };

    fetchItems();
  }, [subcategory, toast]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
  };

  const handleSubcategoryChange = (e) => {
    const selectedSubcategory = e.target.value;
    setSubcategory(selectedSubcategory);
  };

  const handleUploadSuccess = ({ attachmentId, fileName }) => {
    setAttachmentId(attachmentId);
    setFileName(fileName);
    toast({
      title: "File uploaded successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleClearAttachment = () => {
    setAttachmentId(null);
    setFileName(null);
  };

  const handleSubmit = () => {
    if (!severity || !category || !subcategory || !item || !description) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Get label for category, subcategory, and item
    const selectedCategory = categories.find((cat) => cat.id == category);
    const selectedSubcategory = subcategories.find(
      (subcat) => subcat.id == subcategory
    );
    const selectedItem = items.find((it) => it.id == item);

    // Check if the labels are found
    if (!selectedCategory || !selectedSubcategory || !selectedItem) {
      toast({
        title: "Error",
        description:
          "Unable to find the corresponding labels for the selected IDs.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      query: description,
      priority: severity,
      subCategory: selectedSubcategory.label,
      item: selectedItem.label,
      category: selectedCategory.label,
      type: "Service",
      attachmentId: attachmentId || undefined,
    };

    const token = localStorage.getItem("token");
    axios
      .post(`http://${apiIp}:3000/tickets/create`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast({
          title: "Success",
          description: `Ticket NO: ${response.data.ticketNo}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        navigate("/raise-a-ticket");
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "An error occurred while submitting the ticket",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Container maxW="container.md" py={8}>
      <Card variant="outline" shadow="lg">
        <CardHeader bg="teal.50" py={6}>
          <Heading size="lg" textAlign="center" color={headingColor}>
            Service Request Form
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Category </FormLabel>
              <Skeleton isLoaded={!loading.categories}>
                <Select
                  value={category}
                  onChange={handleCategoryChange}
                  bg="gray.50"
                  placeholder="Select a category"
                >
                  {categories?.map((cat) => (
                    <option value={cat.id} key={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </Select>
              </Skeleton>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Subcategory </FormLabel>
              <Skeleton isLoaded={!loading.subcategories}>
                <Select
                  value={subcategory}
                  onChange={handleSubcategoryChange}
                  bg="gray.50"
                  placeholder="Select a subcategory"
                  isDisabled={!category}
                >
                  {subcategories?.map((subcat) => (
                    <option value={subcat.id} key={subcat.id}>
                      {subcat.label}
                    </option>
                  ))}
                </Select>
              </Skeleton>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Item </FormLabel>
              <Skeleton isLoaded={!loading.items}>
                <Select
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  bg="gray.50"
                  placeholder="Select an item"
                  isDisabled={!subcategory}
                >
                  {items?.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Skeleton>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description </FormLabel>
              <Textarea
                placeholder="Enter request description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                minH="120px"
              />
            </FormControl>

            {!attachmentId ? (
              <FormControl>
                <FormLabel>Attach File (Optional)</FormLabel>
                <MediaUploader
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={(error) => {
                    toast({
                      title: "Upload Error",
                      description: "Error while uploading file",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                    console.error(error);
                  }}
                  maxSizeMB={10}
                  uploadUrl={`http://${apiIp}:3000/media/upload`}
                  acceptedFileTypes={[
                    "application/pdf",
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                  ]}
                  disabled={!!attachmentId}
                />
              </FormControl>
            ) : (
              <>
                <Flex w="full" justify="flex-end" mb="-10px" zIndex="2">
                  <IconButton
                    aria-label="Remove attachment"
                    icon={<X color="red" />}
                    variant="ghost"
                    onClick={handleClearAttachment}
                  />
                </Flex>
                <Box w="full">
                  <Divider my={4} />
                  <Text mb={2} fontWeight="medium">
                    Attachment
                  </Text>
                  <MediaPreview mediaId={attachmentId} />
                </Box>
              </>
            )}

            <HStack w="full" spacing={4} justify="space-between" mt={4}>
              <Button
                colorScheme="gray"
                size="lg"
                onClick={() => navigate("/raise-a-ticket")}
                _hover={{ bg: "gray.500", color: "white" }}
                transition="all 0.2s"
                flex="1"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleSubmit}
                _hover={{ transform: "translateY(-2px)" }}
                transition="all 0.2s"
                flex="1"
              >
                Submit
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ServiceRequestForm;
