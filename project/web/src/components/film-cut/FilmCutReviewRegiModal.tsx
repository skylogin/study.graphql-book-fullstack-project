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
  Textarea 
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cutReviewInput: { 
        cutId,
        contents: '',
      },
    },
  });

  function onSubmit(formData: any): void{
    console.log(formData);
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>감상 남기기</ModalHeader>
        <ModalBody>
          <FormControl isInvalid={!!errors.cutReviewInput?.contents}>
            <Textarea
              {...register('cutReviewInput.contents', {
                required: { value: true, message: '감상평을 입력해주세요. '},
                maxLength: {
                  value: 500,
                  message: '500자를 초과할 수 없습니다.',
                },
              })}
              placeContent="장면에 대한 개인적인 감상을 남겨주세요."
            />
            <FormErrorMessage>
              {errors.cutReviewInput?.contents?.message}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button colorScheme="teal" type="submit">등록</Button>
            <Button onClick={onClose}>취소</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

};
