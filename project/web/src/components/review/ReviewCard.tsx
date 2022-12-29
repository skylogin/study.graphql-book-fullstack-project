import {
  Box, 
  Heading, 
  LinkBox, 
  Stack, 
  Text, 
  useColorModeValue,
  LinkOverlay,
  useDisclosure
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { CutReviewsByUserQuery } from '../../generated/graphql';

import FilmCutModal from '../film-cut/FilmCutModal';

interface ReviewCardProps {
  review: CutReviewsByUserQuery['cutReviewsByUser'][0];
}

export default function ReviewCard({ review }: ReviewCardProps): React.ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCutId, setSelectedCutId] = useState<number>();
  const handleCutSelect = (cutId: number) => {
    setSelectedCutId(cutId);
    onOpen();
  };

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
        <Stack>
          <LinkOverlay cursor="pointer" onClick={() => handleCutSelect(review.cutId)}>
            <Heading
              color={useColorModeValue('gray.700', 'white')}
              fontSize="x1"
              fontFamily="body"
            >
              {review.contents}
            </Heading>
          </LinkOverlay>
        </Stack>
        <Stack spacing={0} fontSize="sm" mt={2}>
          <Text isTruncated>
            {review.user.username} ({review.user.email})
          </Text>
          <Text as="time" dateTime={review.createdAt} isTruncated color="gray.500">
            최초 작성: {new Date(parseInt(review.createdAt, 10)).toLocaleDateString()}
          </Text>
          <Text as="time" dateTime={review.updatedAt} isTruncated color="gray.500">
            최근 수정: {new Date(parseInt(review.updatedAt, 10)).toLocaleDateString()}
          </Text>
        </Stack>
      </Box>

      {!selectedCutId ? null : (
        <FilmCutModal 
          open={isOpen} 
          onClose={onClose} 
          cutId={selectedCutId} 
          onLeft={()=>{}}
          onRight={()=>{}}
        />
      )}
    </LinkBox>
  );
}