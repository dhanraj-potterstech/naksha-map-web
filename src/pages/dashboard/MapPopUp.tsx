import React from "react";
import mapboxgl from "mapbox-gl";
import { Box, HStack, IconButton, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, VStack } from "@chakra-ui/react";
import { useGetSelectedDataByIdMutation } from "../../services/places";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

export interface MapPopUpProps {
    isOpen: boolean;
    feature: any;
    onClose: () => void
    onClickPrev: () => void
    onClickNext: () => void
}

export default function MapPopUp({ isOpen, feature, onClose, onClickPrev, onClickNext }: MapPopUpProps) {
    /* ++++++++++ Function Constants ++++++++++ */
    const [doGetSelectedDataById, { isLoading, data: responseData, isError }]
        = useGetSelectedDataByIdMutation()
    /* ---------- Function Constants ---------- */

    /* ++++++++++ Side Effects ++++++++++ */
    React.useEffect(() => {
        if (feature && feature.properties) {
            doGetSelectedDataById({ id: feature.properties.id })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feature])
    React.useEffect(() => {
        if (responseData && responseData.data && responseData.data.url) {
            window.pannellum.viewer('panorama', {
                "type": "equirectangular",
                "panorama": responseData.data.url,
                "autoLoad": true,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [responseData])
    /* ---------- Side Effects ---------- */

    /* ++++++++++ Function Methods ++++++++++ */
    /* ---------- Function Methods ---------- */
    return (
        <Modal
            closeOnOverlayClick={true}
            isCentered
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay
                bg='none'
                backdropFilter='auto'
                backdropInvert='80%'
                backdropBlur='2px'
            />
            {
                isLoading || !responseData || !responseData.data
                    ? <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                    : <ModalContent w='100%' h='100%' maxWidth='90vw' maxHeight='90vh' bg='gray'>
                        <VStack w='100%' h='100%' maxWidth='90vw' maxHeight='90vh' justify='center' alignItems='center'>
                            <HStack w='100%' maxWidth='90vw' justify='center' alignItems='center' py={2}>
                                <IconButton
                                    icon={<ArrowLeftIcon />}
                                    aria-label={""}
                                    onClick={onClickPrev}
                                />
                                <IconButton
                                    icon={<ArrowRightIcon />}
                                    aria-label={""}
                                    onClick={onClickNext}
                                />
                            </HStack>
                            <Box id="panorama" w='100%' h='94%' maxWidth='90vw' maxHeight='94vh'></Box>
                        </VStack>

                    </ModalContent>
            }
        </Modal>
    );
};
