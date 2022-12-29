import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, useColorModeValue } from '@chakra-ui/react';

import SearchInput from '../input/SearchInput';

function ReviewSearch(): React.ReactElement {
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
      <SearchInput
        inputType="number"
        placeholder="사용자 ID를 입력해주세요 (숫자)"
        labelTitle="검색할 사용자"
        buttonTitle="검색"
        onChange={onChange}
        onSubmit={onSearchButton}
      />
    </Box>
  );
}

export default ReviewSearch;