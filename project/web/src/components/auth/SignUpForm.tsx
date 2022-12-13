import { 
  Box, 
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading, 
  Input,
  Stack, 
  Text, 
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { SignUpMutationVariables, useSignUpMutation } from '../../generated/graphql';

function SignUpRealForm(){
  const [signUp, { loading }] = useSignUpMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpMutationVariables>();
  const history = useHistory();
  const toast = useToast();

  const onSubmit = async (data: SignUpMutationVariables) => {
    const { signUpInput } = data;

    return signUp({ variables: { signUpInput } })
      .then((res) => {
        if(res.data?.signUp){
          toast({ title: '회원가입을 환영합니다!', status: 'success' });
          history.push('/');
        } else{
          toast({
            title: '회원가입 도중 문제가 발생했습니다.',
            status: 'error',
          });
        }
      }).catch((err) => {
        toast({ title: '이메일 또는 아이디가 중복됩니다.', status: 'error' });
        return err;
      });
  };

  return (
    <Stack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.signUpInput?.email}>
        <FormLabel>이메일</FormLabel>
        <Input 
          type="email" 
          placeholder="example@example.com" 
          {...register('signUpInput.email', {
            required: '이메일을 입력해주세요.',
            pattern: {
              // eslint-disable-next-line no-control-regex
              value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
              message: '이메일의 형식이 올바르지 않습니다.',
            },
          })} 
        />
        <FormErrorMessage>
          {errors.signUpInput?.email && errors.signUpInput.email.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.signUpInput?.username}>
        <FormLabel>아이디</FormLabel>
        <Input 
          type="text" 
          placeholder="example" 
          {...register('signUpInput.username', {
            required: '아이디를 입력해주세요.',
          })} 
        />
        <FormErrorMessage>
          {errors.signUpInput?.username && errors.signUpInput.username.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.signUpInput?.password}>
        <FormLabel>암호</FormLabel>
        <Input 
          type="password" 
          placeholder="8자 이상의 영문, 숫자, 특문" 
          {...register('signUpInput.password', {
            required: '암호를 입력해주세요.',
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
              message: '암호는 문자,숫자,특수 문자를 포함한 8자 이상이어야 합니다.',
            },
          })} 
        />
        <FormErrorMessage>
          {errors.signUpInput?.password && errors.signUpInput.password.message}
        </FormErrorMessage>
      </FormControl>

      <Divider />
      <Button colorScheme="teal" type="submit" isLoading={loading}>
        계정 생성
      </Button>
    </Stack>
  );
}

export default function SignUpForm(): React.ReactElement {
  return (
    <Stack spacing={8} mx="auto" maxW="1g" py={12} px={6}>
      <Stack align="center">
        <Heading fontSize="4x1">지브리 명장면 프로젝트</Heading>
        <Text fontSize="1g" color="gray.600">
          가입을 환영합니다!
        </Text>
      </Stack>

      <Box
        rounded="1g"
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow="1g"
        p={8}
      >
        <SignUpRealForm />
      </Box>
    </Stack>
  )
}