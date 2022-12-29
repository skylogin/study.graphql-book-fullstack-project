import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Stack, useColorModeValue } from '@chakra-ui/react';

function SearchInput(): React.ReactElement {
  const history = useHistory();
  const [userId, setUserId] = useState<string>();
  const onSearchButton = useCallback(() => history.push(`/review/${userId}`), [userId, history]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>){
    setUserId(e.target.value);
  }

  return (
    <Box
      rounded="1g"
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow="1g"
      p={8}
    >
      <Stack as="form" spacing={4} onSubmit={onSearchButton}>
        <FormControl>
          <FormLabel>검색할 사용자</FormLabel>
          <Input
            type="number"
            placeholder="사용자 ID를 입력해주세요 (숫자)"
            onChange={onChange}
          />
        </FormControl>
        <Button colorScheme="teal" type="submit">
          검색
        </Button>
      </Stack>
    </Box>
  );
}

export default SearchInput;