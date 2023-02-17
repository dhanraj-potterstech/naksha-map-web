import React from "react";
import {
    VStack,
    Box,
    Spinner,
    Image
} from '@chakra-ui/react';
import { useGetSelectedDataByIdMutation } from "../../services/places";
declare global {
    interface Window {
        pannellum?: any;
    }
}
export default function PopupContent(props: any) {
    /* ++++++++++ Function Constants ++++++++++ */
    const [doGetSelectedDataById, { isLoading, data: responseData, isError }] = useGetSelectedDataByIdMutation()
    /* ---------- Function Constants ---------- */

    /* ++++++++++ Side Effects ++++++++++ */
    React.useEffect(() => {
        if (props && props.feature) {
            doGetSelectedDataById({ id: props.feature.properties.id })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    React.useEffect(() => {
        if (responseData && responseData.data && responseData.data.imagePath) {
            window.pannellum.viewer('panorama', {
                "type": "equirectangular",
                "panorama": responseData.data.imagePath,
                "autoLoad": true,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [responseData])
    /* ---------- Side Effects ---------- */

    // console.log({ isLoading, responseData, isError })
    return (
        <VStack>
            <Box w='50vw' h='50vh' bg='white'>
                {
                    isLoading || !responseData || !responseData.data
                        ? <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                        // : <Image src={responseData.data.imagePath} />
                        : <div id="panorama"></div>
                }
            </Box>
        </VStack>
    );
}
