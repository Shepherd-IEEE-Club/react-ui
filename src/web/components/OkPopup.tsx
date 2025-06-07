import React from "react";
import styled from "styled-components";
import {Button} from "@woco/web/pages/style.ts";
import Modal from "@woco/web/components/Modal.tsx";
import {modalManager} from "@woco/web/pages/ModalManager.tsx";


const Container = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;
`;

const Message = styled.p`
    margin-bottom: 1.5rem;
`;

interface Props {
    message: string;
    onOk?: () => void;
}

export const OkPopup: React.FC<Props> = ({message, onOk}) => {
    const handleOk = () => {
        modalManager.pop();
        onOk?.();
    };

    return (
        <Container>
            <Message>{message}</Message>
            <Button onClick={handleOk}>OK</Button>
        </Container>
    );
};


export default OkPopup;