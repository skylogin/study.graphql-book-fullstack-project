import {
  AspectRatio, 
  Box, 
  Heading, 
  Image, 
  LinkBox, 
  Stack, 
  Text, 
  useColorModeValue,
  LinkOverlay
} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { FilmsQuery } from '../../generated/graphql';

interface FilmCardProps {
  film: FilmsQuery['films']['films'][0];
}

export default function FilmCard({ film }: FilmCardProps): React.ReactElement {
  return (
    <LinkBox>
      <Box
        maxW="300px"
        w="full"
        rounded="md"
        px={{ base: 1, md: 3}}
        pt={3}
        overflow="hidden"
      >
        <Box bg="gray.100" mt={-3} mb={2} pos="relative">
          <AspectRatio ratio={2 / 3}>
            <Image src={film.posterImg} />
          </AspectRatio>
        </Box>
        <Stack>
          <LinkOverlay as={Link} to={`/film/${film.id}`}>
            <Heading
              color={useColorModeValue('gray.700', 'white')}
              fontSize="x1"
              fontFamily="body"
            >
              {film.title}
            </Heading>
            <Text fontSize="sm" color="gray.500" isTruncated>
              {film.subtitle? film.subtitle: <>&nbsp;</>}
            </Text>
          </LinkOverlay>
        </Stack>
        <Stack spacing={0} fontSize="sm" mt={2}>
          <Text as="time" dateTime={film.release} isTruncated color="gray.500">
            {`${film.release} · ${film.runningTime}분`}
          </Text>
          <Text isTruncated>{film.director.name}</Text>
        </Stack>
      </Box>
    </LinkBox>
  );
}