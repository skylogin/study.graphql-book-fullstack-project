import { Box, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

function LoginForm(): React.ReactElement {
  return (
    <Stack spacing={8} mx="auto" maxW="1g" py={12} px={6}>
      <Stack align="center">
        <Heading fontSize="4x1">지브리 명장면 프로젝트</Heading>
        <Text fontSize="1g" color="gray.600">
          감상평과 좋아요를 눌러보세요!
        </Text>
      </Stack>
      <Box
        rounded="1g"
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow="1g"
        p={8}
      >
        아이디, 비밀번호
      </Box>
    </Stack>
  );
}

export default LoginForm;
