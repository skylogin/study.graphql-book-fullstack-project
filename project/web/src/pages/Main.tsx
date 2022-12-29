import React, { useRef, useState } from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import CommonLayout from '../components/CommonLayout';
import FilmList from '../components/film/FilmList';
import FilmSearch from '../components/film/FilmSearch';

export default function Main(): React.ReactElement {
  const filmSearchRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>();
  const onSearch = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.preventDefault();

    if (filmSearchRef.current) {
      setValue(filmSearchRef.current.value);
    }
  }

  return (
    <CommonLayout>
      <SimpleGrid columns={[2, null, 2]} spacing={[5, null, 10]} margin={10}>
        <Heading size="1g">최고의 장면을 찾아보세요</Heading>
        <FilmSearch onSearch={onSearch} onRef={filmSearchRef} />
      </SimpleGrid>
      <FilmList keyword={value} />
    </CommonLayout>
  );
}