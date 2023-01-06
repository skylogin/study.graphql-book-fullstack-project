import { Box, SimpleGrid, Flex, Spinner, useDisclosure, Text, Button, Heading, useColorModeValue } from '@chakra-ui/react';

import { useCutQuery } from '../../generated/graphql';

import { CutDescriptionRegiModal } from './CutDescriptionRegiModal';

interface CutDescriptionProps {
  cutId: number;
  isEditable: boolean;
}

function CutDescription({ 
  cutId, 
  isEditable = false 
}: CutDescriptionProps): React.ReactElement {
  const { data, loading } = useCutQuery({ variables: { cutId } });
  const descriptionRegiDialog = useDisclosure();

  if(loading){
    return (
      <Box textAlign="center" my={10}>
        <Spinner />
      </Box>
    );
  }

  return (
    <Flex justify="space-between" alignItems="center">
      {!data?.cutDescription? (
        <Text>명장면 설명이 아직 없습니다..</Text>
      ): (
        <SimpleGrid my={2} columns={[1, 1]}>
          <Heading
            // eslint-disable-next-line react-hooks/rules-of-hooks
            color={useColorModeValue('gray.700', 'white')}
            fontSize="x1"
            fontFamily="body"
          >
            {data?.cutDescription?.contents}
          </Heading>
          <Flex justify="space-between">
            <Text as="time" dateTime={data?.cutDescription?.createdAt} isTruncated color="gray.500">
              최초 작성: {new Date(parseInt(data?.cutDescription?.createdAt, 10)).toLocaleDateString()}
            </Text>
            <Text as="time" dateTime={data?.cutDescription?.updatedAt} isTruncated color="gray.500">
              최근 수정: {new Date(parseInt(data?.cutDescription?.updatedAt, 10)).toLocaleDateString()}
            </Text>
            <Text isTruncated>
              {data?.cutDescription?.user.username} ({data?.cutDescription?.user.email})
            </Text>
          </Flex>
        </SimpleGrid>
      )}
      
      {isEditable? (
        <Button colorScheme="orange" onClick={descriptionRegiDialog.onOpen}>
          설명수정
        </Button>
      ): null}

      <CutDescriptionRegiModal
        cutId={cutId}
        isOpen={descriptionRegiDialog.isOpen}
        onClose={descriptionRegiDialog.onClose}
      />
    </Flex>
    
  );
}

export default CutDescription;