import { 
  Button, 
  ButtonGroup, 
  FormControl, 
  FormErrorMessage, 
  Modal, 
  ModalBody, 
  ModalContent,
  ModalFooter,
  ModalHeader, 
  ModalOverlay, 
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import {
  CutDocument,
  CutQuery,
  CreateOrUpdateCutReviewMutationVariables as CutReviewVars,
  useCreateOrUpdateCutReviewMutation as useCreateCutReview,
} from '../../generated/graphql'

export interface FilmCutReviewRegiModalProps {
  cutId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function FilmCutReviewRegiModal({
  cutId,
  isOpen,
  onClose,
}: FilmCutReviewRegiModalProps): JSX.Element {
  const toast = useToast();
  const [mutation, { loading }] = useCreateCutReview();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CutReviewVars>({
    defaultValues: {
      cutReviewInput: { 
        cutId,
      },
    },
  });

  function onSubmit(formData: CutReviewVars): void{
    mutation({ 
      variables: formData,
      update: (cache, { data }) => {
        if (data && data.createOrUpdateCutReview) {
          const currentCut = cache.readQuery<CutQuery>({
            query: CutDocument,
            variables: { cutId },
          });
          if (currentCut) {
            const isEdited = currentCut.cutReviews
              .map((review) => review.id)
              .includes(data.createOrUpdateCutReview.id);
            if (isEdited) {
              cache.evict({
                id: `CutReview:${data.createOrUpdateCutReview.id}`,
              });
            }
            cache.writeQuery<CutQuery>({
              query: CutDocument,
              data: {
                ...currentCut,
                cutReviews: isEdited
                  ? [ ...currentCut.cutReviews]
                  : [
                      data.createOrUpdateCutReview,
                      ...currentCut.cutReviews.slice(0, 1),
                    ],
              },
              variables: { cutId },
            });
          }
        } 
      },
    })
      .then(onClose)
      .catch(() => {
        toast({ title: '????????? ?????? ??????', status: 'error' });
      });
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>?????? ?????????</ModalHeader>
        <ModalBody>
          <FormControl isInvalid={!!errors.cutReviewInput?.contents}>
            <Textarea
              {...register('cutReviewInput.contents', {
                required: { value: true, message: '???????????? ??????????????????. '},
                maxLength: {
                  value: 500,
                  message: '500?????? ????????? ??? ????????????.',
                },
              })}
              placeContent="????????? ?????? ???????????? ????????? ???????????????."
            />
            <FormErrorMessage>
              {errors.cutReviewInput?.contents?.message}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button colorScheme="teal" type="submit" isDisabled={loading}>
              ??????
            </Button>
            <Button onClick={onClose}>??????</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

};
