import React, { useState, useEffect, use } from "react";
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
  Card,
  CardBody,
  CardHeader,
  Text,
  Divider,
  Flex,
  Skeleton,
  HStack,
  IconButton,
  useColorModeValue,
  Input,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageSquare, X } from "lucide-react";
import MediaUploader from "./mediaUploader";
import MediaPreview from "./mediaPreview";
import { useAuth } from "../providers/authProvider";

const apiIp = process.env.REACT_APP_API_IP;

const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const user = useAuth();

  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("High");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [item, setItem] = useState("");
  const [attachmentId, setAttachmentId] = useState(null);
  const [userId, setUserId] = useState("");
  const [fileName, setFileName] = useState(null);
  const [name, setName] = useState("");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState({
    categories: false,
    subcategories: false,
    items: false,
  });
  const headingColor = useColorModeValue("teal.600", "teal.200");

  const handleCancel = () => {
    navigate("/raise-a-ticket?tab=home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          `http://${apiIp}/tickets/drop/category?type=Service`,
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

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (category) {
        setLoading((prev) => ({ ...prev, subcategories: true }));
        setSubcategory("");
        setItem("");
        setItems([]);

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
        setSubcategories([]);
        setSubcategory("");
        setItems([]);
        setItem("");
      }
    };

    fetchSubcategories();
  }, [category, toast]);

  useEffect(() => {
    const fetchItems = async () => {
      if (subcategory) {
        setLoading((prev) => ({ ...prev, items: true }));
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
    // toast({
    //   title: "File uploaded successfully!",
    //   status: "success",
    //   duration: 5000,
    //   isClosable: true,
    // });
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

    const selectedCategory = categories.find((cat) => cat.id == category);
    const selectedSubcategory = subcategories.find(
      (subcat) => subcat.id == subcategory
    );
    const selectedItem = items.find((it) => it.id == item);

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
      userId: userId,
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
    <Card overflow={'hidden'}>
      <CardHeader bg="teal.50" py={6} backgroundImage="linear-gradient(to right, #abede0, #e6fffa)">
        <Heading
          size="lg"
          textAlign="left"
          display={'flex'}
          alignItems={'center'}
          gap={4}
          color={headingColor}
        >
          <MessageSquare size={32} />
          Service Request Form
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={6}>
          <Stack width={'full'} direction={{ base: "column", md: "row" }}>
            <FormControl isRequired>
              <FormLabel>Category </FormLabel>
              <Skeleton isLoaded={!loading.categories}>
                <Select
                  value={category}
                  onChange={handleCategoryChange}
                  bg="gray.50"
                  placeholder="Select a category"
                  focusBorderColor="teal.400"
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
                  focusBorderColor="teal.400"
                >
                  {subcategories?.map((subcat) => (
                    <option value={subcat.id} key={subcat.id}>
                      {subcat.label}
                    </option>
                  ))}
                </Select>
              </Skeleton>
            </FormControl>
          </Stack>
          <Stack width={'full'} direction={{ base: "column", md: "row" }}>
            <FormControl isRequired>
              <FormLabel>Item </FormLabel>
              <Skeleton isLoaded={!loading.items}>
                <Select
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  bg="gray.50"
                  placeholder="Select an item"
                  isDisabled={!subcategory}
                  focusBorderColor="teal.400"
                >
                  {items?.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Skeleton>
            </FormControl>

            {(user?.role === "admin" || user?.role === "it") && (
              <Stack spacing={4} direction="row" align="center" w={'full'}>
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
          </Stack>
          <FormControl isRequired>
            <FormLabel>Description </FormLabel>
            <Textarea
              placeholder="Enter request description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minH="120px"
              focusBorderColor="teal.400"
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
                uploadUrl={`http://${apiIp}/media/upload`}
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
        </VStack>
      </CardBody>
    </Card >
  );
};

export default ServiceRequestForm;
