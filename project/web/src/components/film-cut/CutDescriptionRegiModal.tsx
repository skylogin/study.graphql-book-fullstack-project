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
  CreateOrUpdateCutDescriptionMutationVariables as CutDescriptionVars,
  useCreateOrUpdateCutDescriptionMutation as useCreateCutDescription,
} from '../../generated/graphql'

export interface CutDescriptionRegiModalProps {
  cutId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function CutDescriptionRegiModal({
  cutId,
  isOpen,
  onClose,
}: CutDescriptionRegiModalProps): JSX.Element {
  const toast = useToast();
  const [mutation, { loading }] = useCreateCutDescription();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CutDescriptionVars>({
    defaultValues: {
      cutDescriptionInput: { 
        id: cutId,
      },
    },
  });

  function onSubmit(formData: CutDescriptionVars): void{
    mutation({ 
      variables: formData,
      update: (cache, { data }) => {
        if (data && data.createOrUpdateCutDescription) {
          const currentCut = cache.readQuery<CutQuery>({
            query: CutDocument,
            variables: { cutId },
          });

          if (currentCut) {
            const isEdited = currentCut.cutDescription?.id === data.createOrUpdateCutDescription.id;
            if (isEdited) {
              cache.evict({
                id: `CutDescription:${data.createOrUpdateCutDescription.id}`,
              });
            }
            cache.writeQuery<CutQuery>({
              query: CutDocument,
              data: {
                ...currentCut,
                cutDescription: data.createOrUpdateCutDescription
              },
              variables: { cutId },
            });
          }
        } 
      },
    })
      .then(onClose)
      .catch(() => {
        toast({ title: '설명 등록 실패', status: 'error' });
      });
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>명장면 설명</ModalHeader>
        <ModalBody>
          <FormControl isInvalid={!!errors.cutDescriptionInput?.contents}>
            <Textarea
              {...register('cutDescriptionInput.contents', {
                required: { value: true, message: '설명을 입력해주세요. '},
                maxLength: {
                  value: 500,
                  message: '500자를 초과할 수 없습니다.',
                },
              })}
              placeContent="설명에 대해 남겨주세요."
            />
            <FormErrorMessage>
              {errors.cutDescriptionInput?.contents?.message}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button colorScheme="teal" type="submit" isDisabled={loading}>
              등록
            </Button>
            <Button onClick={onClose}>취소</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

};
