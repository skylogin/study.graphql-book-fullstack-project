import React from 'react';

import SearchInput from '../input/SearchInput';


interface FilmSearchInputProps {
  onSearch: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onRef: React.RefObject<HTMLInputElement>,
};

function FilmSearch({
  onSearch,
  onChange,
  onRef,
}: FilmSearchInputProps): React.ReactElement {
  return (
      <SearchInput
        placeholder="영화 또는 감독의 이름을 입력해주세요 (숫자)"
        labelTitle="검색어"
        buttonTitle="검색"
        onChange={onChange}
        onClick={onSearch}
        onRef={onRef}
      />
  );
}

export default FilmSearch;