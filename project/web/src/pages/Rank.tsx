import React, { useState } from 'react';
import { Box, Text, Spinner, Heading, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useCutsByVoteQuery, Cut as CutProps } from '../generated/graphql';

import CommonLayout from '../components/CommonLayout';
import Cut from '../components/film-cut/Cut';
import FilmCutModal from '../components/film-cut/FilmCutModal';


function Rank(): React.ReactElement {
  const { data, loading, error } = useCutsByVoteQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCutId, setSelectedCutId] = useState<number>();
  const handleCutSelect = (cutId: number) => {
    setSelectedCutId(cutId);
    onOpen();
  };

  let sortData: any;
  if (data && data?.cutsByVote){
    sortData = [...data?.cutsByVote];
    sortData = sortData.sort((a: CutProps, b: CutProps) => b.votesCount - a.votesCount);
  }

  const onLeft = (currentCutId: number, cuts: [CutProps] | undefined) => {
    if (!cuts) return;
    const seq = getSequence(currentCutId, cuts, -1);
    const target = cuts[seq]?.id;
    if (target){
      setSelectedCutId(target);
    }
  }

  const onRight = (currentCutId: number, cuts: [CutProps] | undefined) => {
    if (!cuts) return;
    const seq = getSequence(currentCutId, cuts, +1);
    const target = cuts[seq]?.id;
    if (target){
      setSelectedCutId(target);
    }
  }

  const getSequence = (currentCutId: number, cuts: [CutProps], add: number) => {
    return cuts.findIndex((e) => e.id === currentCutId) + add;
  }

  return (
    <CommonLayout>
      { loading && <Spinner /> }
      { error && <Text>페이지를 표시할 수 없습니다.</Text> }
      
      {sortData ? (
        <>
          <Heading size="1g">명장면 랭킹!!</Heading>
          <SimpleGrid my={4} columns={[1, 2, null, 3]} spacing={[2, null, 8]}>
            {sortData.map((cut: CutProps) => (
              <Box mt={12} key={cut.id}>
                <Cut src={cut.src} handleCutSelect={() => handleCutSelect(cut.id)} />
                <Text>좋아요: {cut.votesCount}</Text>
                <Text>{cut.film?.title} / {cut.film?.director?.name}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </>
      ) : (
        <Text>페이지를 표시할 수 없습니다.</Text>
      )}

      {!selectedCutId ? null : (
        <FilmCutModal 
          open={isOpen} 
          onClose={onClose} 
          cutId={selectedCutId} 
          onLeft={() => onLeft(selectedCutId, sortData)} 
          onRight={() => onRight(selectedCutId, sortData)} 
        />
      )}
    </CommonLayout>
  );
}

export default Rank;