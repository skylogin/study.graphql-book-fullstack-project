import { Box, Image, LinkBox, LinkOverlay, SimpleGrid, Spinner, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import LazyLoad from 'react-lazyload';

import { useCutsQuery } from '../../generated/graphql';

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

  const onLeft = (currentCutId: number) => {
    if(currentCutId < 2) return;
    setSelectedCutId(currentCutId - 1);
  }

  const onRight = (currentCutId: number, maxLength: number | undefined) => {
    if(maxLength && currentCutId > maxLength-1) return;
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
        <LazyLoad height={200} once key={cut.id}>
          <LinkBox as="article">
            <Box>
              <LinkOverlay cursor="pointer" onClick={() => handleCutSelect(cut.id)}>
                <Image src={cut.src}/>
              </LinkOverlay>
            </Box>
          </LinkBox>
        </LazyLoad>
      ))}
      {!selectedCutId ? null : (
        <FilmCutModal 
          open={isOpen} 
          onClose={onClose} 
          cutId={selectedCutId} 
          onLeft={() => onLeft(selectedCutId)} 
          onRight={() => onRight(selectedCutId, data?.cuts.length)} 
        />
      )}
    </SimpleGrid>
    
  );
}

export default FilmCutList;