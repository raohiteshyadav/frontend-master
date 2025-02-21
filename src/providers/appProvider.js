// src/AppProviders.js
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();
//const theme = extendTheme({});
const AppProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Toaster position="top-right" />
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
