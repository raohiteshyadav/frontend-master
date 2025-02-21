import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  Icon,
  Text,
  VStack,
  useToast,
  Progress,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Cloud, CloudUpload, X } from "lucide-react";

const DEFAULT_ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
];
const DEFAULT_MAX_SIZE = 10;
const apiIp = process.env.REACT_APP_API_IP;
export const MediaUploader = ({
  onUploadSuccess,
  onUploadError,
  maxSizeMB = DEFAULT_MAX_SIZE,
  uploadUrl = `http://${apiIp}:3000/media/upload`,
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
}) => {
  const [uploadingFile, setUploadingFile] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (!file) return;

      setError(null);
      setUploadingFile({ file, progress: 0 });

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress =
              (progressEvent.loaded / (progressEvent.total || file.size)) * 100;
            setUploadingFile((prev) => (prev ? { ...prev, progress } : null));
          },
        });

        const { id, name } = response.data;

        onUploadSuccess({ attachmentId: id, fileName: name });

        toast({
          title: "Upload Successful",
          description: `File ${name} has been uploaded successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setUploadingFile(null);
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || "Upload failed"
          : "Upload failed";

        setError(errorMessage);
        onUploadError?.(errorMessage);

        toast({
          title: "Upload Failed",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        setUploadingFile(null);
      }
    },
    [uploadUrl, onUploadSuccess, onUploadError, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]?.message || "Invalid file";
      setError(error);
      onUploadError?.(error);
    },
  });

  const cancelUpload = useCallback(() => {
    setUploadingFile(null);
    setError(null);
  }, []);

  return (
    <FormControl isInvalid={!!error}>
      <VStack spacing={4} align="stretch">
        <Box
          {...getRootProps()}
          borderWidth={2}
          borderRadius="md"
          borderStyle="dashed"
          borderColor={
            isDragActive ? "blue.500" : error ? "red.500" : "gray.200"
          }
          bg={isDragActive ? "blue.50" : "transparent"}
          p={6}
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            borderColor: "blue.500",
            bg: "blue.50",
          }}
        >
          <input {...getInputProps()} />
          <Center flexDirection="column" gap={2}>
            <Icon as={CloudUpload} w={8} h={8} color="gray.400" />
            <VStack spacing={1}>
              <Text fontSize="sm" color="gray.600">
                {isDragActive
                  ? "Drop the file here"
                  : "Drag & drop a file here, or click to select"}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Accepted files: PDF, Images (JPEG, PNG, GIF) up to {maxSizeMB}MB
              </Text>
            </VStack>
          </Center>
        </Box>

        {uploadingFile && (
          <Box borderWidth={1} borderRadius="md" p={4}>
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="sm" noOfLines={1}>
                  {uploadingFile.file.name}
                </Text>
                <IconButton
                  size="sm"
                  icon={<X />}
                  aria-label="Cancel upload"
                  onClick={cancelUpload}
                />
              </HStack>
              <Progress
                value={uploadingFile.progress}
                size="sm"
                colorScheme="blue"
                hasStripe
                isAnimated
              />
            </VStack>
          </Box>
        )}

        <FormErrorMessage>{error}</FormErrorMessage>
      </VStack>
    </FormControl>
  );
};

export default MediaUploader;
