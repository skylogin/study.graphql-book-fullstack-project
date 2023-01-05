import React from 'react';
import { Box, Text, Spinner, Heading, SimpleGrid } from '@chakra-ui/react';
import { useCutsByVoteQuery } from '../generated/graphql';

import CommonLayout from '../components/CommonLayout';
import Cut from '../components/film-cut/Cut';


function Rank(): React.ReactElement {
  const { data, loading, error } = useCutsByVoteQuery();

  let sortData;
  if (data && data?.cutsByVote){
    sortData = [...data?.cutsByVote];
    sortData = sortData.sort((a,b) => b.votesCount - a.votesCount);
  }

  return (
    <CommonLayout>
      { loading && <Spinner /> }
      { error && <Text>페이지를 표시할 수 없습니다.</Text> }
      
      {sortData ? (
        <>
          <Heading size="1g">명장면 랭킹!!</Heading>
          <SimpleGrid my={4} columns={[1, 2, null, 3]} spacing={[2, null, 8]}>
            {sortData.map((cut) => (
              <Box mt={12} key={cut.id}>
                <Cut src={cut.src} />
                <Text>좋아요: {cut.votesCount}</Text>
                <Text>{cut.film?.title} / {cut.film?.director?.name}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </>
      ) : (
        <Text>페이지를 표시할 수 없습니다.</Text>
      )}
    </CommonLayout>
  );
}

export default Rank;