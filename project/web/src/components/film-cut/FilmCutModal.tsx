import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useBreakpointValue,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useCutQuery } from '../../generated/graphql';
import { FilmCutDetail } from './FilmCutDetail';

interface FilmCutModalProps {
  open: boolean;
  onClose: () => void;
  cutId: number;
  onLeft: () => void;
  onRight: () => void;
}

function FilmCutModal({
  open,
  onClose,
  cutId,
  onLeft,
  onRight,
}: FilmCutModalProps): React.ReactElement {
  const { loading, data } = useCutQuery({
    variables: { cutId: Number(cutId) },
  });

  const modalSize = useBreakpointValue({ base: 'full', md: 'xl' });

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          onLeft();
          break;
        case "ArrowRight":
          onRight();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyboardEvent, false);
    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent, false);
    };
  }, [onLeft, onRight]);



  return (
    <Modal
      onClose={onClose}
      isOpen={open}
      isCentered
      size={modalSize}
      preserveScrollBarGap
    >
      <ModalOverlay />
      <ModalContent pt={2}>
        <ModalHeader>{data?.cut?.film?.title}</ModalHeader>
        <ModalCloseButton mt={3} />
        <ModalBody>
          {loading && (
            <Center py={4}>
              <Spinner />
            </Center>
          )}
          {!loading && !data && <Center>데이터를 불러오지 못했습니다.</Center>}
          {data && data.cut && (
            <FilmCutDetail 
              cutImg={data.cut.src} 
              cutId={data.cut.id} 
              votesCount={data.cut.votesCount}
              isVoted={data.cut.isVoted}
              reviews={data.cutReviews}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default FilmCutModal;