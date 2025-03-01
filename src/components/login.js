import React, { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useToast,
  Grid,
  GridItem,
} from "@chakra-ui/react";

const apiIp = process.env.REACT_APP_API_IP;

const Login = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState("email");
  const navigate = useNavigate();
  const toast = useToast();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://${apiIp}:3000/user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");
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
      const response = await fetch(`http://${apiIp}:3000/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passkey: otp }),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/raise-a-ticket");
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
      const response = await fetch(`http://${apiIp}:3000/user/verify-pass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passkey :  password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log(data);
      localStorage.setItem("token", data.token);
      navigate("/raise-a-ticket");
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
      templateColumns={{base:"1fr", md:"1fr 1fr"}}
      minH="79vh"
      maxH="79vh"
      overflowY={"hidden"}
    >
      <GridItem
        minH="80vh"
        bgImage="https://blog.octobits.io/wp-content/uploads/2023/12/octobits-it-services-management-framework.png"
        bgSize="cover"
        bgPosition="center"
        display ={{base:"none", md:"block" }}
      />  

      <GridItem
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
      >
        <Box
          bg="white"
          p={8}
          borderRadius="md"
          boxShadow="lg"
          w="full"
          maxW="md"
        >
          <Text fontSize={"xl"} textAlign="center" mb={6}>
            {loginType === "email"
              ? showOtp
                ? "Enter OTP"
                : "Login with Email OTP"
              : "Login with Password"}
          </Text>

          <form
            onSubmit={
              loginType === "email"
                ? showOtp
                  ? handleOtpSubmit
                  : handleEmailSubmit
                : handlePasswordSubmit
            }
          >
            <Stack spacing={4}>
              {/* Conditional Rendering Based on Login Type */}
              {loginType === "email" ? (
                <>
                  {/* Email and OTP Form */}
                  {!showOtp ? (
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Mail size={20} />
                      </InputLeftElement>
                      <Input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        required
                      />
                    </InputGroup>
                  ) : (
                    <>
                      <InputGroup>
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
                          required
                        />
                      </InputGroup>
                      <InputGroup>
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
                        />
                      </InputGroup>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Password Form */}
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Mail size={20} />
                    </InputLeftElement>
                    <Input
                      type="text"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your RML Id"
                      required
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Lock size={20} />
                    </InputLeftElement>
                    <Input
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter your password"
                      required
                    />
                  </InputGroup>
                </>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Processing..."
                rightIcon={!loading && <ArrowRight size={16} />}
              >
                {loginType === "email"
                  ? showOtp
                    ? "Verify OTP"
                    : "Continue"
                  : "Login"}
              </Button>

              {showOtp && (
                <Button variant="outline" onClick={() => setShowOtp(false)}>
                  Back to Email
                </Button>
              )}
            </Stack>
          </form>

          <Button
            variant="link"
            onClick={() =>
              handleLoginTypeToggle(
                loginType === "email" ? "password" : "email"
              )
            }
            mt={4}
            color="blue.500"
          >
            {loginType === "email"
              ? "Login with Username-Password"
              : "Login with Email OTP"}
          </Button>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default Login;
