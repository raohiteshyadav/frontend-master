import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Input,
  Button,
  FormLabel,
  Select,
  FormControl,
  Grid,
  GridItem,
  Spinner,
  useToast,
  Container,
  Heading,
  InputGroup,
  InputRightElement,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";

const UserCat = () => {
  const [requestType, setRequestType] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [newItem, setNewItem] = useState("");
  const [categoryAdded, setCategoryAdded] = useState(false);
  const [subCategoryAdded, setSubCategoryAdded] = useState(false);
  const [itemAdded, setItemAdded] = useState(false);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  const apiIp = process.env.REACT_APP_API_IP;

  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      if (requestType) {
        setLoadingCategories(true);
        const token = localStorage.getItem("token");

        try {
          const response = await axios.get(
            `http://${apiIp}:3000/tickets/drop/category?type=${requestType}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCategories(response.data);
          setLoadingCategories(false);
          setSelectedCategory("");
          setSubcategories([]);
          setItems([]);
        } catch (error) {
          console.error(error);
          setLoadingCategories(false);
        }
      } else {
        setCategories([]);
        setSelectedCategory("");
        setSubcategories([]);
        setItems([]);
      }
    };

    fetchCategories();
  }, [requestType]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        setLoadingSubcategories(true);

        const token = localStorage.getItem("token");

        try {
          const response = await axios.get(
            `http://${apiIp}:3000/tickets/drop/sub-category?id=${selectedCategory}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSubcategories(response.data);
          setLoadingSubcategories(false);
          setSelectedSubcategory("");
          setItems([]);
        } catch (error) {
          console.error(error);
          setLoadingSubcategories(false);
        }
      } else {
        setSubcategories([]);
        setItems([]);
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchItems = async () => {
      if (selectedSubcategory) {
        setLoadingItems(true);
        const token = localStorage.getItem("token");

        try {
          const response = await axios.get(
            `http://${apiIp}:3000/tickets/drop/item?id=${selectedSubcategory}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setItems(response.data);
          setLoadingItems(false);
          setSelectedItem("");
        } catch (error) {
          console.error(error);
          setLoadingItems(false);
        }
      } else {
        setItems([]);
      }
    };

    fetchItems();
  }, [selectedSubcategory]);

  const handleRequestTypeChange = (e) => {
    setRequestType(e.target.value);
  };

  const handleAddCategory = () => {
    const token = localStorage.getItem("token");

    const categoryExists = categories.some(
      (category) =>
        category.label.toLowerCase() === newCategory.trim().toLowerCase()
    );

    if (categoryExists) {
      toast({
        title: "Category already exists",
        description: "The category you are trying to add already exists.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newCategory.trim()) {
      setCategoryAdded(true);
      axios
        .post(
          `http://${apiIp}:3000/tickets/add/category`,
          { name: newCategory, type: requestType },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setCategories([...categories, response.data]);
          setNewCategory("");
          setCategoryAdded(false);
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: "Error",
            description: "There was an error adding the category.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setCategoryAdded(false);
        });
    }
  };

  const handleAddSubcategory = () => {
    const token = localStorage.getItem("token");
    console.log(subcategories);
    const subcategoryExists = subcategories.some(
      (subcategory) =>
        subcategory.label &&
        subcategory.label.toLowerCase() === newSubcategory.trim().toLowerCase()
    );

    if (subcategoryExists) {
      toast({
        title: "Subcategory already exists",
        description: "The subcategory you are trying to add already exists.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newSubcategory.trim() && selectedCategory) {
      setSubCategoryAdded(true);
      axios
        .post(
          `http://${apiIp}:3000/tickets/add/sub-category`,
          { name: newSubcategory, id: Number(selectedCategory) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setSubcategories([...subcategories, response.data]);
          setNewSubcategory("");
          setSubCategoryAdded(false);
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: "Error",
            description: "There was an error adding the subcategory.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setSubCategoryAdded(false);
        });
    }
  };

  const handleAddItem = () => {
    const token = localStorage.getItem("token");
    const itemExists = items.some(
      (item) =>
        item.label && item.label.toLowerCase() === newItem.trim().toLowerCase()
    );

    if (itemExists) {
      toast({
        title: "item already exist",
        description: "The item you are trying to add already exists.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newItem.trim() && selectedSubcategory) {
      setItemAdded(true);
      axios
        .post(
          `http://${apiIp}:3000/tickets/add/item`,
          { name: newItem, id: Number(selectedSubcategory) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setItems([...items, response.data]);
          setNewItem("");
          setItemAdded(false);
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: "Error",
            description: "There was an error adding the item.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setItemAdded(false);
        });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        border="1px"
        borderColor="gray.200"
      >
        <VStack spacing={8} align="stretch">
          <Heading size="lg" textAlign="center" color="gray.700">
            Category Management
          </Heading>

          {/* Request Type Section */}
          <Box>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              alignItems="flex-end"
            >
              <GridItem>
                <FormControl>
                  <FormLabel fontWeight="medium">Request Type</FormLabel>
                  <Select
                    value={requestType}
                    onChange={handleRequestTypeChange}
                    placeholder="Select Request Type"
                    h="40px"
                  >
                    <option value="Service">Service</option>
                    <option value="Incident">Incident</option>
                  </Select>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel fontWeight="medium">Add Category</FormLabel>
                  <InputGroup>
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter New Category"
                      isDisabled={!requestType}
                      h="40px"
                    />
                  </InputGroup>
                </FormControl>
              </GridItem>

              <GridItem>
                <Button
                  onClick={handleAddCategory}
                  colorScheme="blue"
                  isDisabled={!requestType || !newCategory.trim()}
                  w="full"
                  h="40px"
                  isLoading={categoryAdded}
                  spinner={<Spinner size="sm" />}
                >
                  Add Category
                </Button>
              </GridItem>
            </Grid>
          </Box>

          <Divider />

          {/* Category Section */}
          <Box>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              alignItems="flex-end"
            >
              <GridItem>
                <FormControl>
                  <FormLabel fontWeight="medium">Category</FormLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    placeholder="Select Category"
                    isDisabled={!requestType || loadingCategories}
                    h="40px"
                  >
                    {loadingCategories ? (
                      <option>Loading...</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))
                    )}
                  </Select>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel fontWeight="medium">Add Subcategory</FormLabel>
                  <Input
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="Enter New Subcategory"
                    isDisabled={!selectedCategory || loadingSubcategories}
                    h="40px"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <Button
                  onClick={handleAddSubcategory}
                  colorScheme="blue"
                  isDisabled={!selectedCategory || loadingSubcategories || !newSubcategory}
                  w="full"
                  h="40px"
                  isLoading={subCategoryAdded}
                  spinner={<Spinner size="sm" />}
                >
                  Add Subcategory
                </Button>
              </GridItem>
            </Grid>
          </Box>

          <Divider />

          {/* Subcategory Section */}
          <Box>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              alignItems="flex-end"
            >
              <GridItem>
                <FormControl>
                  <FormLabel fontWeight="medium">Subcategory</FormLabel>
                  <Select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    placeholder="Select Subcategory"
                    isDisabled={
                      !selectedCategory ||
                      loadingSubcategories ||
                      !subcategories.length
                    }
                    h="40px"
                  >
                    {loadingSubcategories ? (
                      <option>Loading...</option>
                    ) : (
                      subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.label}
                        </option>
                      ))
                    )}
                  </Select>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel fontWeight="medium">Add Item</FormLabel>
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Enter New Item"
                    isDisabled={!selectedSubcategory || loadingItems}
                    h="40px"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <Button
                  onClick={handleAddItem}
                  colorScheme="blue"
                  isDisabled={!selectedSubcategory || loadingItems}
                  w="full"
                  h="40px"
                  isLoading={itemAdded}
                  spinner={<Spinner size="sm" />}
                >
                  Add Item
                </Button>
              </GridItem>
            </Grid>
          </Box>

          <Divider />

          {/* Item Section */}
          <Box>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
            >
              <GridItem colSpan={{ base: 1, md: 3 }}>
                <FormControl>
                  <FormLabel fontWeight="medium">Item</FormLabel>
                  <Select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    placeholder="Select Item"
                    isDisabled={
                      !selectedSubcategory || loadingItems || !items.length
                    }
                    h="40px"
                  >
                    {loadingItems ? (
                      <option>Loading...</option>
                    ) : (
                      items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))
                    )}
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
};

export default UserCat;
