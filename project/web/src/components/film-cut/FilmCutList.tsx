import { Box, SimpleGrid, Spinner, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';

import { useCutsQuery } from '../../generated/graphql';

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

  const onLeft = (currentCutId: number, startNumber: number | undefined) => {
    if (!startNumber) return;
    if(startNumber && currentCutId < startNumber + 1) return;
    setSelectedCutId(currentCutId - 1);
  }

  const onRight = (currentCutId: number, endNumber: number | undefined) => {
    if (!endNumber) return;
    if (endNumber && currentCutId > endNumber - 1) return;
    setSelectedCutId(currentCutId + 1);
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
          onLeft={() => onLeft(selectedCutId, data?.cuts[0].id)} 
          onRight={() => onRight(selectedCutId, data?.cuts[data?.cuts.length-1].id)} 
        />
      )}
    </SimpleGrid>
    
  );
}

export default FilmCutList;