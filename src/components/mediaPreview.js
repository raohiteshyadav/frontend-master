import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Image,
  Link,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  VStack,
  Center,
  Button,
  useToast,
} from "@chakra-ui/react";
import { DownloadIcon } from "lucide-react";
const apiIp = process.env.REACT_APP_API_IP;
const extractFileName = (contentDisposition) => {
  if (!contentDisposition) return "Unknown File";

  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(contentDisposition);
  if (matches?.[1]) {
    return matches[1].replace(/['"]/g, "");
  }
  return "Unknown File";
};

const MediaPreview = ({
  mediaId,
  baseUrl = `http://${apiIp}:3000`,
}) => {
  const [mediaState, setMediaState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();

    const fetchMedia = async () => {
      try {
        const response = await axios.get(`${baseUrl}/media/download/${mediaId}`, {
          responseType: "blob",
          signal: controller.signal,
        });

        const mediaUrl = URL.createObjectURL(response.data);
        const fileName = extractFileName(
          response.headers["content-disposition"]
        );

        setMediaState({
          data: {
            name: fileName,
            mimeType:
              response.headers["content-type"] || "application/octet-stream",
            fileUrl: mediaUrl,
          },
          loading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to load media";

        setMediaState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchMedia();

    return () => {
      controller.abort();
      if (mediaState.data?.fileUrl) {
        URL.revokeObjectURL(mediaState.data.fileUrl);
      }
    };
  }, [mediaId, baseUrl, toast]);

  const renderMediaContent = (file) => {
    const { name, mimeType, fileUrl } = file;

    const downloadButton = (
      <Button
        as={Link}
        href={fileUrl}
        download={name}
        colorScheme="blue"
        leftIcon={<DownloadIcon />}
        size="md"
        mt={2}
      >
        Download file
      </Button>
    );

    if (mimeType.startsWith("image/")) {
      return (
        <VStack spacing={4} align="start">
          <Heading size="md">{name}</Heading>
          <Box
            position="relative"
            width="100%"
            borderRadius="md"
            overflow="hidden"
            boxShadow="lg"
          >
            <Image
              src={fileUrl}
              alt={name}
              maxW="100%"
              loading="lazy"
              fallback={
                <Center p={8}>
                  <Spinner />
                </Center>
              }
            />
          </Box>
          {downloadButton}
        </VStack>
      );
    }

    if (mimeType === "application/pdf") {
      return (
        <VStack spacing={4} align="start">
          <Heading size="md">{name}</Heading>
          <Box
            position="relative"
            width="100%"
            height="600px"
            borderRadius="md"
            overflow="hidden"
            boxShadow="lg"
          >
            <iframe
              src={fileUrl}
              style={{ width: "100%", height: "100%", border: 0 }}
              title={`${name} Preview`}
            />
          </Box>
          {downloadButton}
        </VStack>
      );
    }

    return (
      <VStack spacing={4} align="start">
        <Heading size="md">{name}</Heading>
        {downloadButton}
      </VStack>
    );
  };

  if (mediaState.loading) {
    return (
      <Center p={8}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (mediaState.error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>{mediaState.error}</AlertDescription>
      </Alert>
    );
  }

  if (!mediaState.data) {
    return (
      <Alert status="info">
        <AlertIcon />
        <AlertDescription>No media found</AlertDescription>
      </Alert>
    );
  }

  return <Box p={4}>{renderMediaContent(mediaState.data)}</Box>;
};

export default MediaPreview;
