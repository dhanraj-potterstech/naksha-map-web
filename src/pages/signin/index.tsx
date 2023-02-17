import React from "react";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

import { useLoginMutation } from "../../services/places";

// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";

export default function SignInPage() {
    /* ++++++++++ Function State ++++++++++ */
    const [state, setState] = React.useState({
        isLoading: false,
        formData: {
            username: "",
            password: "",
        },
    });
    /* ---------- Function State ---------- */

    /* ++++++++++ Function Constants ++++++++++ */
    const toast = useToast()
    const navigate = useNavigate();
    // const { register, handleSubmit, formState } = useForm();
    // const errors = formState ? formState.errors : null;
    // const dispatch = useDispatch();
    const [doLogin, { isLoading: isLoggingIn, data: responseData, isError }] = useLoginMutation()
    /* ---------- Function Constants ---------- */

    /* ++++++++++ Side Effects ++++++++++ */
    React.useEffect(() => {
        let message = 'something went wrong'
        if (responseData) {
            console.log({ responseData })
            if (responseData.status === '200' && responseData.data) {
                // login successful
                navigate("/dashboard");
                return
            } else if (responseData.message) {
                message = responseData.message
            }
        }
        toast({
            title: 'Login error.',
            description: message,
            status: 'error',
            duration: 9000,
            isClosable: true,
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, responseData])
    /* ---------- Side Effects ---------- */

    /* ++++++++++ Function Methods ++++++++++ */
    const updateForm = (key: string, value: string) =>
        setState((prevState) => {
            const formData = { ...state.formData };
            formData[key as keyof typeof state.formData] = value;

            return { ...prevState, formData };
        });
    const onSubmit = () => {
        doLogin({
            username: state.formData.username,
            password: state.formData.password
        })
    };
    /* ---------- Function Methods ---------- */

    /* ++++++++++ Function Render Methods ++++++++++ */
    /* ---------- Function Render Methods ---------- */
    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id="username">
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="username"
                                value={state.formData.username}
                                onChange={(e) => updateForm('username', e.target.value)}
                            />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={state.formData.password}
                                onChange={(e) => updateForm('password', e.target.value)}
                            />
                        </FormControl>
                        <Stack spacing={10}>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                isLoading={isLoggingIn}
                                onClick={onSubmit}
                            >
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}