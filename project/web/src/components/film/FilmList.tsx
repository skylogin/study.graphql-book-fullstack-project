import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Waypoint } from 'react-waypoint';
import { useFilmsQuery } from '../../generated/graphql';
import FilmCard from './FilmCard';


interface FilmListInputProps {
  keyword: string | undefined;
};

export default function FilmList({
  keyword = "",
}: FilmListInputProps): JSX.Element {
  const LIMIT = 6;
  const { data, loading, error, fetchMore, refetch } = useFilmsQuery({
    variables: {
      limit: LIMIT,
      cursor: 1,
      keyword,
    }
  });

  useEffect(() => {
    refetch();
  }, [keyword, refetch]);

  if(error) return <p>{error.message}</p>;

  return (
    <SimpleGrid columns={[2, null, 3]} spacing={[2, null, 10]}>
      {loading &&
        new Array(6).fill(0).map((x, i) => <Skeleton key={i} height="400px" />)}
      {!loading &&
        data &&
        data.films.films.map((film, i) => (
          <Box key={film.id}>
            <FilmCard film={film} />
            {data.films.cursor && i === data.films.films.length - LIMIT / 2 && (
              <Waypoint
                onEnter={() => {
                  fetchMore({
                    variables: {
                      limit: LIMIT,
                      cursor: data.films.cursor,
                    },
                  });
                }}
              />
            )}
          </Box>
        ))}      
    </SimpleGrid>
  );
}