import React from 'react';
import { Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';

interface SearchInputProps {
  inputType?: string,
  placeholder?: string,
  labelTitle: string,
  buttonTitle: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit?: () => void,
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void,
  onRef?: React.RefObject<HTMLInputElement>,
};

function SearchInput({
  inputType = "text",
  placeholder = "입력해주세요",
  labelTitle = "검색조건",
  buttonTitle = "검색",
  onChange,
  onSubmit,
  onClick,
  onRef,
}: SearchInputProps): React.ReactElement {
  return (
    <Stack as="form" spacing={4} onSubmit={onSubmit}>
      <FormControl>
        <FormLabel>{labelTitle}</FormLabel>
        <Input
          ref={onRef}
          type={inputType}
          placeholder={placeholder}
          onChange={onChange}
        />
      </FormControl>
      <Button colorScheme="teal" type="submit" onClick={onClick}>
        {buttonTitle}
      </Button>
    </Stack>
  );
}

export default SearchInput;