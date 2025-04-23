import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Flex,
  Image,
  useColorModeValue,
  Progress,
  Button
} from "@chakra-ui/react";
import { AuthProvider, useAuth } from "./providers/authProvider";
import AppProviders from "./providers/appProvider";
import PreviewHead from "./components/previewhead";
import PreviewSerIt from "./components/previewserit";
import DashboardIt from "./components/dashboardit";
import PreviewIncSerIt from "./components/previewincserit";
import Footer from "./components/footer";
import UserList from "./components/itsuperadmin";
import UserCat from "./components/itsuperadmincat";
import SuperAdmin from "./components/superadmin";
import { Home, LogIn } from "lucide-react";
import MediaPreview from "./components/mediaPreview";
import './App.css'

const ServiceRequestForm = lazy(() => import("./components/ServiceRequestForm"));
const IncidentRequestForm = lazy(() => import("./components/IncidentRequestForm"));
const Dashboard = lazy(() => import("./components/dashboard"));
const Navbar = lazy(() => import("./components/Navbar"));
const Raise = lazy(() => import("./components/Raise"));
const Login = lazy(() => import("./components/login"));
const ContactUs = lazy(() => import("./components/contactus"));
const ManagerHome = lazy(() => import("./components/ManagerHome"));

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        return newProgress >= 98 ? 98 : newProgress;
      });
    }, 10);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Flex
      width="100%"
      height="100vh"
      direction="column"
      justifyContent="center"
      alignItems="center"
      bg={useColorModeValue("gray.100", "gray.300")}
    >
      <Image
        src="/logo_black.png"
        alt="Rashmi Group Logo"
        maxW="200px"
        mb={4}
      />
      {/* <Spinner
        size="xl"
        thickness="4px"
        speed="0.65s"
        color="blue.500"
        mb={4}
      /> */}
      <Box w="300px" mb={2}>
        <Progress value={progress} size="sm" colorScheme="blue" borderRadius="md" />
      </Box>
      <Text color="gray.500" fontSize="sm">
        Loading application... {progress}%
      </Text>
    </Flex>
  );
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = useAuth();
  const bgColor = useColorModeValue("red.50", "red.900");
  const textColor = useColorModeValue("red.600", "red.200");
  const navigate = useNavigate();

  if (!user) {
    return (
      <Flex
        width="full"
        minH="80vh"
        justify="center"
        align="center"
        bg={bgColor}
        p={8}
        borderRadius="md"
        direction="column"
        gap={4}
      >
        <Text
          color={textColor}
          fontSize="xl"
          fontWeight="bold"
        >
          Access Denied: User is not logged in
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => navigate("/login")}
          leftIcon={<LogIn size={18} />}
        >
          Go to Login
        </Button>
      </Flex>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <Flex
        width="full"
        minH="80vh"
        justify="center"
        align="center"
        bg={bgColor}
        p={8}
        borderRadius="md"
        direction="column"
        gap={4}
      >
        <Text
          color={textColor}
          fontSize="xl"
          fontWeight="bold"
        >
          Permission Denied: Your role does not have access to this area
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => navigate("/raise-a-ticket")}
          leftIcon={<Home size={18} />}
        >
          Go to Home
        </Button>
      </Flex>
    );
  }

  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <AppProviders>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<LoadingScreen />}>
            <Flex direction="column" minH="100vh">
              <Navbar />
              <Box flex="1" className="custom-text">
                <Routes>
                  <Route path="/service-request-form/:id" element={<PreviewHead />} />
                  <Route path="/service-request-form-it/:id" element={<PreviewSerIt />} />
                  <Route path="/service-request-form-dept/:id" element={<PreviewIncSerIt />} />
                  <Route path="/media-preview/:id" element={<MediaPreview />} />
                  <Route path="/raise-a-ticket" element={<Raise />} />
                  <Route path="/service-request" element={<ServiceRequestForm />} />
                  <Route path="/incident-request" element={<IncidentRequestForm />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute allowedRoles={["it"]}>
                        <DashboardIt />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/approval"
                    element={
                      <ProtectedRoute allowedRoles={["head", "it", "admin"]}>
                        <ManagerHome />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/superadmin-userlist"
                    element={
                      <ProtectedRoute allowedRoles={["it", "admin"]}>
                        <UserList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/superadmin-category"
                    element={
                      <ProtectedRoute allowedRoles={["it", "admin"]}>
                        <UserCat />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/superadmin"
                    element={
                      <ProtectedRoute allowedRoles={["it", "admin"]}>
                        <SuperAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/contact" element={<ContactUs />} />
                </Routes>
              </Box>
              <Footer />
            </Flex>
          </Suspense>
        </AuthProvider>
      </AppProviders>
    </Router>
  );
}

export default App;