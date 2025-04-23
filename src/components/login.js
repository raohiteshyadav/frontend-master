import React, { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
  Grid,
  GridItem,
  Flex,
  Heading,
  useBreakpointValue,
  FormControl,
  FormLabel,
  useColorModeValue
} from "@chakra-ui/react";

const apiIp = process.env.REACT_APP_API_IP;

const Login = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState("email");
  const navigate = useNavigate();
  const toast = useToast();

  const formWidth = useBreakpointValue({ base: "90%", sm: "400px", md: "450px" });
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://${apiIp}/user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");

      toast({
        title: "OTP Sent",
        description: "Please check your email for the OTP",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setShowOtp(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://${apiIp}/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passkey: otp }),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/raise-a-ticket");
      }, 1000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://${apiIp}/user/verify-pass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passkey: password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/raise-a-ticket");
      }, 1000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleResendOtp = () => {
    handleEmailSubmit({ preventDefault: () => { } });
  };

  const handleLoginTypeToggle = (type) => {
    setLoginType(type);
    setShowOtp(false);
    setOtp("");
    setPassword("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/raise-a-ticket");
  }, [navigate]);

  return (
    <Grid
      p={{ base: 0, md: 1 }}
      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
      minH={{ base: "calc(100vh - 145px)", md: "80vh" }}
      maxH={{ base: "none", md: "80vh" }}
      paddingBottom={0}
      overflowY="auto"
    >
      <GridItem
        minH={{ base: "25vh", md: "78vh" }}
        maxH={{ base: "25vh", md: "78vh" }}
        bgImage="url(/itsmLogin.png)"
        bgSize="cover"
        bgPosition="center"
        display={{ base: "none", md: "block" }}
        overflow={'hidden'}
        borderRadius={{ base: "0", md: "lg" }}
        boxShadow="lg"
      />

      <GridItem
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={useColorModeValue("gray.50", "gray.900")}
        // p={{ base: 4, md: 8 }}
        minH={{ base: "500px", md: "78vh" }}
      >
        <Flex
          direction="column"
          bg={bgColor}
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          // boxShadow="xl"
          w={formWidth}
          border="1px"
          borderColor={borderColor}
        >
          <Heading as="h2" size="lg" textAlign="center" mb={{ base: 4, md: 4 }} color="blue.600">
            {loginType === "email"
              ? showOtp
                ? "Enter OTP"
                : "Login with Email OTP"
              : "Login with Password"}
          </Heading>

          <form
            onSubmit={
              loginType === "email"
                ? showOtp
                  ? handleOtpSubmit
                  : handleEmailSubmit
                : handlePasswordSubmit
            }
          >
            <Stack spacing={5}>
              {loginType === "email" ? (
                <>
                  {!showOtp ? (
                    <FormControl isRequired>
                      <FormLabel>Email Address</FormLabel>
                      <InputGroup size="lg">
                        <InputLeftElement pointerEvents="none">
                          <Mail size={20} />
                        </InputLeftElement>
                        <Input
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="Enter your email"
                          focusBorderColor="blue.400"
                          required
                        />
                      </InputGroup>
                    </FormControl>
                  ) : (
                    <>
                      <FormControl>
                        <FormLabel>Email Address</FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <Mail size={20} />
                          </InputLeftElement>
                          <Input
                            type="email"
                            value={email}
                            readOnly
                            onDoubleClick={() => setShowOtp(false)}
                            placeholder="Enter your email"
                            color="gray.500"
                            focusBorderColor="blue.400"
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>OTP</FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <Lock size={20} />
                          </InputLeftElement>
                          <Input
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="Enter 4-digit OTP"
                            required
                            maxLength={4}
                            focusBorderColor="blue.400"
                          />
                        </InputGroup>
                      </FormControl>
                    </>
                  )}
                </>
              ) : (
                <>
                  <FormControl isRequired>
                    <FormLabel>RML ID</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none">
                        <Mail size={20} />
                      </InputLeftElement>
                      <Input
                        type="text"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your RML ID"
                        required
                        focusBorderColor="blue.400"
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none">
                        <Lock size={20} />
                      </InputLeftElement>
                      <Input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        required
                        focusBorderColor="blue.400"
                      />
                    </InputGroup>
                  </FormControl>
                </>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={loading}
                loadingText="Processing..."
                rightIcon={!loading && <ArrowRight size={16} />}
                mt={2}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
              >
                {loginType === "email"
                  ? showOtp
                    ? "Verify OTP"
                    : "Continue"
                  : "Login"}
              </Button>

              {showOtp && (
                <Flex justify="space-between" mt={2}>
                  <Button variant="ghost" onClick={() => setShowOtp(false)} size="sm">
                    Back to Email
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleResendOtp}
                    size="sm"
                    rightIcon={<RefreshCw size={14} />}
                    isLoading={loading}
                  >
                    Resend OTP
                  </Button>
                </Flex>
              )}
            </Stack>
          </form>

          <Button
            variant="link"
            onClick={() => handleLoginTypeToggle(loginType === "email" ? "password" : "email")}
            mt={6}
            color="blue.500"
            alignSelf="center"
          >
            {loginType === "email"
              ? "Login with Username-Password"
              : "Login with Email OTP"}
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Login;