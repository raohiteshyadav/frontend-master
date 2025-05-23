import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AlertTriangleIcon, X } from "lucide-react";
import MediaUploader from "./mediaUploader";
import MediaPreview from "./mediaPreview";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Button,
  Stack,
  Flex,
  Text,
  IconButton,
  Divider,
  useColorModeValue,
  useToast,
  HStack,
  Input,
} from "@chakra-ui/react";
import { useAuth } from "../providers/authProvider";

const apiIp = process.env.REACT_APP_API_IP;

const IncidentRequestForm = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [item, setItem] = useState("");
  const [attachmentId, setAttachmentId] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");

  // States for fetched data
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState({
    categories: false,
    subcategories: false,
    items: false,
  });

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headingColor = useColorModeValue("teal.600", "teal.200");
  const requiredColor = "red.500";

  // Fetch categories on component mount

  const handleCreatedBy = async (createdById) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://${apiIp}/user/info?id=${createdById}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.name) {
        setName(response.data.name);
      } else {
        setName('');
      }
    } catch (err) {
      setName('');
      console.error("Error in getting user details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading((prev) => ({ ...prev, categories: true }));
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://${apiIp}/tickets/drop/category?type=Incident`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };

    fetchCategories();
  }, []);

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
            `http://${apiIp}/tickets/drop/sub-category?id=${category}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSubcategories(response.data);
        } catch (error) {
          console.error(error);
          toast.error("Error fetching subcategories");
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
  }, [category]);

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
            `http://${apiIp}/tickets/drop/item?id=${subcategory}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setItems(response.data);
        } catch (error) {
          console.error(error);
          toast.error("Error fetching items");
        } finally {
          setLoading((prev) => ({ ...prev, items: false }));
        }
      } else {
        setItems([]);
        setItem("");
      }
    };

    fetchItems();
  }, [subcategory]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubcategory("");
    setItem("");
    setSubcategories([]);
    setItems([]);
  };

  const handleSubcategoryChange = (e) => {
    const selectedSubcategory = e.target.value;
    setSubcategory(selectedSubcategory);
    setItem("");
    setItems([]);
  };

  const handleUploadSuccess = ({ attachmentId, fileName }) => {
    setAttachmentId(attachmentId);
    setFileName(fileName);
  };

  const handleClearAttachment = () => {
    setAttachmentId(null);
    setFileName(null);
  };

  const handleCancel = () => {
    navigate("/raise-a-ticket?tab=home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!severity || !category || !subcategory || !item) {
      toast.error("Please fill all required fields!");
      return;
    }

    const selectedCategory = categories.find((cat) => cat.id == category);
    const selectedSubcategory = subcategories.find(
      (subcat) => subcat.id == subcategory
    );
    const selectedItem = items.find((it) => it.id == item);

    if (!selectedCategory || !selectedSubcategory || !selectedItem) {
      toast.error(
        "Error: Unable to find the corresponding labels for the selected IDs."
      );
      return;
    }

    const payload = {
      userId: userId,
      query: description,
      priority: severity,
      subCategory: selectedSubcategory.label,
      item: selectedItem.label,
      category: selectedCategory.label,
      type: "Incident",
      attachmentId: attachmentId || undefined,
    };

    const token = localStorage.getItem("token");
    axios
      .post(`http://${apiIp}/tickets/create`, payload, {
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
        handleCancel();
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while submitting the ticket");
      });
  };

  return (
    <Card
      bg={cardBg}
      overflow="hidden"
    >
      <CardHeader bg="teal.50" py={6} backgroundImage="linear-gradient(to right, #abede0, #e6fffa)">
        <Heading
          size="lg"
          textAlign="left"
          display={'flex'}
          alignItems={'center'}
          gap={4}
          color={headingColor}
        >
          <AlertTriangleIcon size={32} />
          Incident Request Form
        </Heading>
      </CardHeader>

      <CardBody pt={6} pb={2}>
        <Stack spacing={6}>
          <Stack width={'full'} direction={{ base: "column", md: "row" }}>
            <FormControl isRequired>
              <FormLabel fontWeight="medium">Category</FormLabel>
              <Select
                placeholder="Select a category"
                value={category}
                onChange={handleCategoryChange}
                isDisabled={loading.categories}
                focusBorderColor="teal.400"
                size="md"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="medium">Subcategory</FormLabel>
              <Select
                placeholder="Select a subcategory"
                value={subcategory}
                onChange={handleSubcategoryChange}
                isDisabled={!category || loading.subcategories}
                focusBorderColor="teal.400"
                size="md"
              >
                {subcategories.map((subcat) => (
                  <option key={subcat.id} value={subcat.id}>
                    {subcat.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack width={'full'} direction={{ base: "column", md: "row" }}>
            <FormControl isRequired>
              <FormLabel fontWeight="medium">Item</FormLabel>
              <Select
                placeholder="Select an item"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                isDisabled={!subcategory || loading.items}
                focusBorderColor="teal.400"
                size="md"
              >
                {items.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="medium">Severity</FormLabel>
              <Select
                placeholder="Select a severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                focusBorderColor="teal.400"
                size="md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </FormControl>
          </Stack>


          {(user?.role === "admin" || user?.role === "it") && (
            <Stack spacing={4} direction="row" align="center">
              <FormControl w="42%">
                <FormLabel>On Behalf of</FormLabel>
                <Input
                  placeholder="Employee ID of third person"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    handleCreatedBy(e.target.value);
                  }}
                  focusBorderColor="teal.400"
                />
              </FormControl>

              <Box textAlign="left" mt={6}>
                {name ? (
                  <Text>
                    You are creating a ticket on behalf of<br />
                    <Text as="span" fontWeight="bold">
                      {name}
                    </Text>
                  </Text>
                ) : userId.trim() ? (
                  <Text color="red.500">User not found</Text>
                ) : null}
              </Box>
            </Stack>
          )}

          <FormControl isRequired>
            <FormLabel fontWeight="medium">Description</FormLabel>
            <Textarea
              placeholder="Please describe the incident in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minH="200px"
              focusBorderColor="teal.400"
              size="md"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="medium">Attach File (Optional)</FormLabel>

            {attachmentId ? (
              <Box position="relative" mb={4}>
                <Flex justifyContent="flex-end" mb={2}>
                  <IconButton
                    icon={<X />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    aria-label="Remove attachment"
                    onClick={handleClearAttachment}
                  />
                </Flex>
                <Box
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  p={3}
                >
                  <MediaPreview mediaId={attachmentId} />
                </Box>
              </Box>
            ) : (
              <MediaUploader
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(error) => {
                  toast.error("Error while uploading file");
                  console.error(error);
                }}
                maxSizeMB={10}
                uploadUrl={`http://${apiIp}/media/upload`}
                acceptedFileTypes={[
                  "application/pdf",
                  "image/jpeg",
                  "image/png",
                  "image/gif",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ]}
                disabled={!!attachmentId}
              />
            )}
          </FormControl>
        </Stack>
      </CardBody>

      <Divider />

      <HStack w="full" justify="space-between" m={0} p={4}>
        <Button
          colorScheme="gray"
          size="lg"
          onClick={() => handleCancel()}
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick
      />
    </Card>
  );
};

export default IncidentRequestForm;
