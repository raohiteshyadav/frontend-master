import React from 'react';
import { Box, Heading, Text, Link, SimpleGrid, VStack } from '@chakra-ui/react';
import { PhoneCall } from 'lucide-react';

const ContactUs = () => {
  const teamMembers = [
    
    { "name": "Souman Maity", "position": "Junior Engineer", "email": "itkgp1@rashmigroup.com" },
    { "name": "Prananta Parida", "position": "Engineer", "email": "itkgp2@rashmigroup.com" },
    { "name": "Rishi Prasad", "position": "Manager", "email": "rishi.prasad@rashmigroup.com" },
    { "name": "Ranbir Kar", "position": "Sr. Manager", "email": "itkgp9@rashmigroup.com" },
    { "name": "Md Jawed Ansari", "position": "Executive", "email": "itkgp3@rashmigroup.com" },
    { "name": "Subrat Kumar Patra", "position": "DGM", "email": "subrat.kumar@rashmigroup.com" },
    { "name": "Susanta Roy", "position": "Senior Executive", "email": "itkgp@rashmigroup.com" },
    { "name": "Priyabrata Bera", "position": "Executive", "email": "itkgp6@rashmigroup.com" },
    { "name": "Shuvadeep Sen", "position": "Executive", "email": "itkgp12@rashmigroup.com" },
    { "name": "Arnab Jana", "position": "Executive", "email": "itkgp13@rashmigroup.com" },
    { "name": "Rajkamal Sahu", "position": "Network Engineer", "email": "itkgp14@rashmigroup.com" },
    { "name": "Samaresh Jana", "position": "IT Support Engineer", "email": "samaresh.jana@rashmigroup.in" }
];

  return (
    <Box position={'relative'} bg="gray.100" py={10}>
      <Heading as="h1" fontSize="3xl" textAlign="center" mb={8}>Contact Us</Heading>
      <Text
      bg={'green.200'}
      p={2}
      borderRadius={'md'}
      position="absolute"
      top="10"
      right="4"
      fontSize="xl"
      color="green.800"
      cursor={'text'}
      display={'flex'}
      gap={2}
      justifyContent={'center'}
      textAlign={'center'}
    >
    <PhoneCall></PhoneCall>+91-9035220720 , +91-8967115788
    </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} px={4}>
        {teamMembers.map((member, index) => (
          <VStack
            key={index}
            bg="white"
            p={6}
            borderRadius="md"
            boxShadow="md"
            textAlign="center"
            spacing={4}
          >
            <Heading as="h3" size="lg" color="gray.700">{member.name}</Heading>
            <Text fontSize="lg" color="gray.500">{member.position}</Text>
            <Link href={`mailto:${member.email}`} color="blue.500" _hover={{ textDecoration: 'underline' }}>
              {member.email}
            </Link>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ContactUs;
