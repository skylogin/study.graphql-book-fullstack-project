import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  useColorModeValue,
  useToast,
  useDisclosure,
  SimpleGrid,
  Center,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { FaHeart } from 'react-icons/fa';
import {
  CutDocument,
  CutQuery,
  CutQueryVariables,
  useVoteMutation,
  useMeQuery,
} from '../../generated/graphql';

import { FilmCutReview } from './FilmCutReview';
import FilmCutReviewDeleteAlert from './FilmCutReviewDelete';
import { FilmCutReviewRegiModal } from './FilmCutReviewRegiModal';
import CutDescription from './CutDescription';

interface MovieCutDetailProps {
  cutImg: string;
  cutId: number;
  isVoted?: boolean;
  votesCount?: number;
  reviews: CutQuery['cutReviews'];
  description?: CutQuery['cutDescription'];
}
export function FilmCutDetail({
  cutImg,
  cutId,
  isVoted = false,
  votesCount = 0,
  reviews,
  description,
}: MovieCutDetailProps): JSX.Element {
  const toast = useToast();
  const voteButtonColor = useColorModeValue('gray.500', 'gray.400');
  const [vote, { loading: voteLoading }] = useVoteMutation({ 
    variables: { cutId },
    update: (cache, fetchResult) => {
      const currentCut = cache.readQuery<CutQuery, CutQueryVariables>({
        query: CutDocument,
        variables: { cutId },
      });
      if (currentCut && currentCut.cut) {
        if (fetchResult.data?.vote) {
          cache.writeQuery<CutQuery, CutQueryVariables>({
            query: CutDocument,
            variables: { cutId: currentCut.cut.id },
            data: {
              __typename: 'Query',
              ...currentCut,
              cut: {
                ...currentCut.cut,
                votesCount: isVoted
                  ? currentCut.cut.votesCount -1
                  : currentCut.cut.votesCount +1,
                isVoted: !isVoted,
              },
            },
          });
        }
      }
    },
  });
  const reviewRegiDialog = useDisclosure();
  const deleteAlert = useDisclosure();
  const descriptionRegiDialog = useDisclosure();

  const accessToken = localStorage.getItem('access_token');
  const { data: userData } = useMeQuery({ skip: !accessToken });
  const isLoggedIn = useMemo(() => {
    if (accessToken) return userData?.me?.id;
    return false;
  }, [accessToken, userData?.me?.id]);

  return (
    <Box>
      <AspectRatio ratio={16 / 9}>
        <Image src={cutImg} objectFit="cover" fallbackSrc="" />
      </AspectRatio>
      <Box py={4}>
        <CutDescription 
          cutId={cutId} 
          cutDescription={description} 
          isEditable={!!isLoggedIn} 
          onOpen={descriptionRegiDialog.onOpen} 
          isOpen={descriptionRegiDialog.isOpen} 
          onClose={descriptionRegiDialog.onClose}
        />
      </Box>

      <Box py={4}>
        <Flex justify="space-between" alignItems="center">
          <Heading size="sm">{cutId} ?????? ??????</Heading>
          <HStack spacing={1} alignItems="center">
            <Button
              color={isVoted ? 'pink.400'  : voteButtonColor} 
              aria-label="like-this-cut-button" 
              leftIcon={<FaHeart />}
              isLoading={voteLoading}
              onClick={() => {
                if (isLoggedIn) vote();
                else {
                  toast({
                    status: 'warning',
                    description: '????????? ????????? ???????????? ?????? ???????????????.',
                  });
                }
              }} 
            >
              <Text>{votesCount}</Text>
            </Button>
            <Button colorScheme="teal" onClick={reviewRegiDialog.onOpen}>
              ???????????????
            </Button>
          </HStack>
        </Flex>

        <Box mt={6}>
          {!reviews || reviews.length === 0 ? (
            <Center minH={100}>
              <Text>?????? ?????? ????????? ???????????????!</Text>
            </Center>
          ): (
            <SimpleGrid mt={3} spacing={4} columns={{ base:1, sm: 2 }}>
              {reviews.slice(0, 2).map((review) => (
                <FilmCutReview
                  key={review.id}
                  author={review.user.username}
                  contents={review.contents}
                  isMine={review.isMine}
                  onEditClick={reviewRegiDialog.onOpen}
                  onDeleteClick={deleteAlert.onOpen}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Box>

      <FilmCutReviewRegiModal
        cutId={cutId}
        isOpen={reviewRegiDialog.isOpen}
        onClose={reviewRegiDialog.onClose}
      />
      <FilmCutReviewDeleteAlert
        target={reviews?.find((review) => review.isMine)}
        isOpen={deleteAlert.isOpen}
        onClose={deleteAlert.onClose}
      />
    </Box>
  );
}