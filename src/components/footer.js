import React from 'react';
import { Box, Text, useBreakpointValue } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const Marquee = ({ text }) => {
  // Define keyframes for the marquee effect
  const marqueeAnimation = keyframes`
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  `;

  // Add some responsive behavior for the speed
  const speed = useBreakpointValue({
    base: '200s',
    md: '100s',
    lg: '50s',
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      textAlign={'center'}
      overflow="hidden"
      width="100%"
      py={4}
      bg={'gray.100'}
    >
      <Box
        as="div"
        display="inline-block"
        whiteSpace="nowrap"
        animation={`${marqueeAnimation} ${speed} linear infinite`}
        fontSize="xl"
        fontWeight="bold"
      >
        {text}
      </Box>
    </Box>
  );
};

const Footer = () => {
  return (
    <footer>
      <Marquee  text="Rashmi Metaliks Limited, Rashmi Green Hydrogen Steel Private Limited, Rashmi 6 Paradigm Limited, Koove IOT Private Limited, Koove Organic Chemicals Private Limited, Reach Dredging Limited, Rashmi Pipe, Ravion Aviation Services Private Limited " />
    </footer>
  );
};

export default Footer;
