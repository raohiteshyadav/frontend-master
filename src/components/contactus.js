import React, { useState } from 'react';
import {
  Box, Heading, Text, Link, SimpleGrid, Container, Badge, Flex, Icon,
  HStack, Input, Select, InputGroup, InputLeftElement, IconButton,
  Collapse, Avatar, SlideFade, Button, Stack, Switch,
  FormControl, FormLabel
} from '@chakra-ui/react';
import {
  PhoneCall, Mail, Briefcase, Code, Terminal, Search, X
} from 'lucide-react';

const ContactUs = () => {
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [showTeam, setShowTeam] = useState(true);
  const [showDevs, setShowDevs] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Color scheme
  const cardBg = 'white';
  const headingColor = 'blue.600';
  const grayTextColor = 'gray.600';
  const grayHeadingColor = 'gray.700';
  const linkColor = 'blue.500';
  const linkHoverColor = 'blue.600';
  const iconBgColor = 'blue.50';
  const iconColor = 'blue.500';

  const developers = [
    {
      "name": "Hitesh Rao Sahab",
      "position": "Full Stack Developer",
      "email": "hiteshalwar299@gmail.com",
      "skills": ["React", "Node.js", "MongoDB", "TypeScript"],
    },
    {
      "name": "Harish Bisu",
      "position": "Backend Developer",
      "email": "harish94@gmail.com",
      "skills": ["NodeJs", "NestJS", "Typescript", "Postgresql"],
    }
  ];

  const teamMembers = [
    { "name": "Souman Maity", "position": "Junior Engineer", "email": "itkgp1@rashmigroup.com" },
    { "name": "Prananta Parida", "position": "Engineer", "email": "itkgp2@rashmigroup.com" },
    { "name": "Rishi Prasad", "position": "Manager", "email": "rishi.prasad@rashmigroup.com" },
    { "name": "Ranbir Kar", "position": "Sr. Manager", "email": "itkgp9@rashmigroup.com" },
    { "name": "Md Jawed Ansari", "position": "Executive", "email": "itkgp3@rashmigroup.com" },
    { "name": "Susanta Roy", "position": "Senior Executive", "email": "itkgp@rashmigroup.com" },
    { "name": "Priyabrata Bera", "position": "Executive", "email": "itkgp6@rashmigroup.com" },
    { "name": "Shuvadeep Sen", "position": "Executive", "email": "itkgp12@rashmigroup.com" },
    { "name": "Arnab Jana", "position": "Executive", "email": "itkgp13@rashmigroup.com" },
    { "name": "Rajkamal Sahu", "position": "Network Engineer", "email": "itkgp14@rashmigroup.com" },
    { "name": "Samaresh Jana", "position": "Engineer", "email": "itkgp16@rashmigroup.in" }
  ];

  const allPositions = [...new Set([...teamMembers, ...developers].map(member => member.position))];

  const filteredTeamMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPosition === '' || member.position === filterPosition)
  );

  const filteredDevelopers = developers.filter(dev =>
    dev.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPosition === '' || dev.position === filterPosition)
  );

  const resetFilters = () => {
    setSearchTerm('');
    setFilterPosition('');
  };

  return (
    <Box bgGradient="linear(to-b, blue.50, gray.50)" minH="100vh" py={10}>
      {/* Header with logo and contact */}
      <Container maxW="container.xl" mb={8}>
        <Flex
          bg="white"
          p={4}
          borderRadius="xl"
          boxShadow="md"
          justifyContent="space-between"
          alignItems="center"
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <Heading as="h1" size="lg" color={headingColor}>
            Rashmi Group IT
          </Heading>

          <Flex position="relative">
            <Button
              leftIcon={<PhoneCall size={18} />}
              colorScheme="blue"
              variant="outline"
              onClick={() => setPhoneVisible(!phoneVisible)}
              _hover={{
                bg: 'blue.50'
              }}
            >
              Helpdesk
            </Button>

            <Collapse in={phoneVisible} animateOpacity>
              <Box
                position="absolute"
                top="100%"
                right={0}
                mt={2}
                p={4}
                bg="white"
                boxShadow="md"
                borderRadius="md"
                zIndex={10}
                minW="250px"
              >
                <Flex align="center" color="blue.700">
                  <PhoneCall size={16} />
                  <Text ml={2} fontWeight="medium">+91-9035220720 <br /> +91-9046141038</Text>
                </Flex>
              </Box>
            </Collapse>
          </Flex>
        </Flex>
      </Container>

      {/* Search and filter section */}
      <Container maxW="container.xl" mb={8}>
        <Box bg="white" p={6} borderRadius="xl" boxShadow="md">
          <Heading size="md" mb={4} color={grayHeadingColor}>
            Find Team Members
          </Heading>

          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={4}>
            <InputGroup size="md" maxW={{ base: "100%", md: "400px" }}>
              <InputLeftElement pointerEvents="none">
                <Search color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                focusBorderColor="blue.400"
              />
            </InputGroup>

            <Select
              placeholder="Filter by position"
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              maxW={{ base: "100%", md: "300px" }}
              focusBorderColor="blue.400"
            >
              {allPositions.map((position, index) => (
                <option key={index} value={position}>
                  {position}
                </option>
              ))}
            </Select>

            <IconButton
              aria-label="Reset filters"
              icon={<X size={18} />}
              onClick={resetFilters}
              variant="outline"
              colorScheme="blue"
              size="md"
              isDisabled={!searchTerm && !filterPosition}
            />
          </Stack>

          <Stack direction="row" spacing={6}>
            <FormControl display="flex" alignItems="center" maxW="200px">
              <FormLabel htmlFor="show-team" mb="0" fontSize="sm" color={grayTextColor}>
                Show IT Team
              </FormLabel>
              <Switch
                id="show-team"
                colorScheme="blue"
                isChecked={showTeam}
                onChange={() => setShowTeam(!showTeam)}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center" maxW="200px">
              <FormLabel htmlFor="show-devs" mb="0" fontSize="sm" color={grayTextColor}>
                Show Developers
              </FormLabel>
              <Switch
                id="show-devs"
                colorScheme="blue"
                isChecked={showDevs}
                onChange={() => setShowDevs(!showDevs)}
              />
            </FormControl>
          </Stack>
        </Box>
      </Container>

      {/* IT Team Section */}
      <Collapse in={showTeam} animateOpacity>
        <Box position={'relative'} py={6} mb={8}>
          <Container maxW="container.xl">
            <Flex
              direction="column"
              align="center"
              mb={8}
              position="relative"
            >
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl' }}
                textAlign="center"
                mb={4}
                color={headingColor}
                fontWeight="bold"
              >
                Our IT Team
              </Heading>

              <Text
                fontSize="lg"
                textAlign="center"
                maxW="800px"
                mb={1}
                color={grayTextColor}
              >
                Connect with our IT professionals who are ready to assist you with technical support and services.
              </Text>

              {filteredTeamMembers.length === 0 && (
                <Box mt={6} p={4} bg="yellow.50" borderRadius="md" borderLeft="4px solid" borderColor="yellow.400">
                  <Text color="yellow.800">No team members match your search criteria. Try adjusting your filters.</Text>
                </Box>
              )}
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {filteredTeamMembers.map((member, index) => (
                <SlideFade in={true} key={index} offsetY="20px" delay={index * 0.05}>
                  <Box
                    bg={cardBg}
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    textAlign="center"
                    _hover={{
                      transform: 'translateY(-5px)',
                      boxShadow: 'lg',
                      borderColor: 'blue.200',
                      borderWidth: '1px'
                    }}
                    transition="all 0.3s ease"
                    position="relative"
                    overflow="hidden"
                    onMouseEnter={() => setHoveredCard(`team-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Avatar
                      size="md"
                      bg={iconBgColor}
                      color={iconColor}
                      name={member.name}
                      mb={4}
                      src={`/api/placeholder/100/100`}
                    />

                    <Heading
                      as="h3"
                      size="md"
                      color={grayHeadingColor}
                      noOfLines={1}
                    >
                      {member.name}
                    </Heading>

                    <Flex align="center" justify="center" mt={2}>
                      <Icon as={Briefcase} w={4} h={4} color="gray.500" mr={2} />
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        fontWeight="medium"
                      >
                        {member.position}
                      </Text>
                    </Flex>

                    <Link
                      href={`mailto:${member.email}`}
                      color={linkColor}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mt={4}
                      _hover={{
                        textDecoration: 'none',
                        color: linkHoverColor
                      }}
                    >
                      <Icon as={Mail} w={4} h={4} mr={2} />
                      <Text noOfLines={1}>{member.email}</Text>
                    </Link>

                    {/* Hover background effect */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      height="8px"
                      bg={hoveredCard === `team-${index}` ? "blue.400" : "blue.200"}
                      transition="all 0.3s ease"
                    />
                  </Box>
                </SlideFade>
              ))}
            </SimpleGrid>
          </Container>
        </Box>
      </Collapse>

      {/* Developers Section */}
      <Collapse in={showDevs} animateOpacity>
        <Box position={'relative'} py={6}>
          <Container maxW="container.xl">
            <Flex
              direction="column"
              align="center"
              mb={8}
              position="relative"
            >
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl' }}
                textAlign="center"
                mb={4}
                color={headingColor}
                fontWeight="bold"
              >
                Our Developers
              </Heading>

              <Text
                fontSize="lg"
                textAlign="center"
                maxW="800px"
                mb={1}
                color={grayTextColor}
              >
                Meet our talented development team who build amazing digital experiences.
              </Text>

              {filteredDevelopers.length === 0 && (
                <Box mt={6} p={4} bg="yellow.50" borderRadius="md" borderLeft="4px solid" borderColor="yellow.400">
                  <Text color="yellow.800">No developers match your search criteria. Try adjusting your filters.</Text>
                </Box>
              )}
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} maxW="900px" mx="auto">
              {filteredDevelopers.map((developer, index) => (
                <SlideFade in={true} key={index} offsetY="20px" delay={index * 0.1}>
                  <Box
                    bg={cardBg}
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    textAlign="center"
                    _hover={{
                      transform: 'translateY(-5px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.3s ease"
                    position="relative"
                    overflow="hidden"
                    onMouseEnter={() => setHoveredCard(`dev-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Code pattern background at top */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      height="60px"
                      bg={hoveredCard === `dev-${index}` ? "blue.500" : "blue.400"}
                      opacity={0.1}
                      backgroundImage="url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
                      transition="all 0.3s ease"
                    />

                    <Avatar
                      size="lg"
                      bg={iconBgColor}
                      color={iconColor}
                      name={developer.name}
                      icon={<Code size={24} />}
                      mb={4}
                      mt={4}
                      zIndex={1}
                      boxShadow="md"
                      src={`/api/placeholder/100/100`}
                    />

                    <Heading
                      as="h3"
                      size="md"
                      color={grayHeadingColor}
                    >
                      {developer.name}
                    </Heading>

                    <Flex align="center" justify="center" mt={2}>
                      <Icon as={Terminal} w={4} h={4} color="gray.500" mr={2} />
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        fontWeight="medium"
                      >
                        {developer.position}
                      </Text>
                    </Flex>

                    <HStack spacing={2} flexWrap="wrap" justify="center" mt={3}>
                      {developer.skills.map((skill, idx) => (
                        <Badge
                          key={idx}
                          colorScheme="blue"
                          variant="subtle"
                          px={2}
                          py={1}
                          borderRadius="md"
                          _hover={{ bg: 'blue.100' }}
                          transition="all 0.2s"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </HStack>

                    <Link
                      href={`mailto:${developer.email}`}
                      color={linkColor}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mt={4}
                      _hover={{
                        textDecoration: 'none',
                        color: linkHoverColor
                      }}
                    >
                      <Icon as={Mail} w={4} h={4} mr={2} />
                      {developer.email}
                    </Link>
                  </Box>
                </SlideFade>
              ))}
            </SimpleGrid>
          </Container>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ContactUs;