import { Box, SimpleGrid, Spinner, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';

import { useCutsQuery, Cut as CutProps } from '../../generated/graphql';

import Cut from '../film-cut/Cut';
import FilmCutModal from '../film-cut/FilmCutModal';


interface FilmCutListProps {
  filmId: number;
}


function FilmCutList({ filmId }: FilmCutListProps): React.ReactElement {
  const { data, loading } = useCutsQuery({ variables: { filmId } });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCutId, setSelectedCutId] = useState<number>();
  const handleCutSelect = (cutId: number) => {
    setSelectedCutId(cutId);
    onOpen();
  };

  let cutsData: any;
  if (data?.cuts){
    cutsData = [...data?.cuts];
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

  if(loading){
    return (
      <Box textAlign="center" my={10}>
        <Spinner />
      </Box>
    );
  }

  return (
    <SimpleGrid my={4} columns={[1, 2, null, 3]} spacing={[2, null, 8]}>
      {data?.cuts.map((cut) => (
        <Cut key={cut.id} src={cut.src} handleCutSelect={() => handleCutSelect(cut.id)} />
      ))}
      {!selectedCutId ? null : (
        <FilmCutModal 
          open={isOpen} 
          onClose={onClose} 
          cutId={selectedCutId} 
          onLeft={() => onLeft(selectedCutId, cutsData)} 
          onRight={() => onRight(selectedCutId, cutsData)} 
        />
      )}
    </SimpleGrid>
    
  );
}

export default FilmCutList;