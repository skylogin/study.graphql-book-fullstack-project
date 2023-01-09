import { SimpleGrid, Flex, Text, Button, Heading, useColorModeValue } from '@chakra-ui/react';

import { CutQuery } from '../../generated/graphql';

import { CutDescriptionRegiModal } from './CutDescriptionRegiModal';

interface CutDescriptionProps {
  cutId: number,
  cutDescription: CutQuery['cutDescription'];
  isEditable: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function CutDescription({ 
  cutId,
  cutDescription, 
  isEditable = false ,
  isOpen,
  onOpen,
  onClose,
}: CutDescriptionProps): React.ReactElement {
  
  return (
    <Flex justify="space-between" alignItems="center">
      {!cutDescription? (
        <Text>명장면 설명이 아직 없습니다..</Text>
      ): (
        <SimpleGrid my={2} columns={[1, 1]}>
          <Heading
            // eslint-disable-next-line react-hooks/rules-of-hooks
            color={useColorModeValue('gray.700', 'white')}
            fontSize="x1"
            fontFamily="body"
          >
            {cutDescription?.contents}
          </Heading>
          <Flex justify="space-between">
            <Text as="time" dateTime={cutDescription?.createdAt} isTruncated color="gray.500">
              최초 작성: {new Date(parseInt(cutDescription?.createdAt, 10)).toLocaleDateString()}
            </Text>
            <Text as="time" dateTime={cutDescription?.updatedAt} isTruncated color="gray.500">
              최근 수정: {new Date(parseInt(cutDescription?.updatedAt, 10)).toLocaleDateString()}
            </Text>
            <Text isTruncated>
              {cutDescription?.user.username} ({cutDescription?.user.email})
            </Text>
          </Flex>

          
        </SimpleGrid>
      )}
      
      {isEditable? (
        <Button colorScheme="orange" onClick={onOpen}>
          설명수정
        </Button>
      ): null}

      <CutDescriptionRegiModal
        cutId={cutId}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
}

export default CutDescription;