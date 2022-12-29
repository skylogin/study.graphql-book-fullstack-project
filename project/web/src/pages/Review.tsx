import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, SimpleGrid, Skeleton, useToast } from '@chakra-ui/react';
import { useCutReviewsByUserQuery } from '../generated/graphql';

import CommonLayout from '../components/CommonLayout';
import ReviewCard from '../components/review/ReviewCard';
import ReviewSearch from '../components/review/ReviewSearch';

interface ReviewPageParams {
  userId: string;
}

function Review(): React.ReactElement {
  const { userId } = useParams<ReviewPageParams>();
  const { data, loading, error } = useCutReviewsByUserQuery({
    variables: { cutReviewsByUserId: Number(userId) },
  });

  const toast = useToast();
  const history = useHistory();
  if(error){
    toast({ title: '로그인을 해주세요.', status: 'error' });
    history.push("/");
  } 

  return (
    <CommonLayout>
      <ReviewSearch />
      <SimpleGrid columns={[2, null, 3]} spacing={[2, null, 10]}>
        {loading &&
          new Array(6).fill(0).map((x, i) => <Skeleton key={i} height="400px" />)}
        {!loading &&
          data &&
          data.cutReviewsByUser.map((review) => (
            <Box key={review.cutId}>
              <ReviewCard review={review} />
            </Box>
          ))}      
      </SimpleGrid>
    </CommonLayout>
  );
}

export default Review;