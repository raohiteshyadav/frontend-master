import React from 'react';
import { Box, Heading, Text, Link, SimpleGrid, VStack } from '@chakra-ui/react';

const ContactUs = () => {
  const teamMembers = [
    { name: "Hitesh Kumar", position: "SDE 1", email: "john.doe@rashmigroup.com" },
    { name: "Harish Kumar", position: "SDE 2", email: "jane.smith@rashmigroup.com" },
    { name: "Anand", position: "SDE", email: "mark.johnson@rashmigroup.com" },
    { name: "Shariquee", position: "SDE", email: "sara.williams@rashmigroup.com" },
    { name: "DVT Reddy", position: "SDE", email: "DVTREDDY9@rashmigroup.com" },
    { name: "Chirag Singh", position: "SDE", email: "chirag3501@rashmigroup.com" },
    { name: "Harsh Vamsi", position: "SDE", email: "harshVamsi@rashmigroup.com" },
    { name: "Bhargav", position: "SDE", email: "bhargav@rashmigroup.com" },
  ];

  return (
    <Box bg="gray.100" py={10}>
      <Heading as="h2" size="xl" textAlign="center" mb={8}>Contact Us</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} px={4}>
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
