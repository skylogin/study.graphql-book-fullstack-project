import { Box, Heading } from '@chakra-ui/react';
import FilmList from '../components/film/FilmList';

export default function Main(): React.ReactElement {
  return (
    <Box>
      <Heading size="1g">최고의 장면을 찾아보세요</Heading>
      <FilmList />
    </Box>
  );
}