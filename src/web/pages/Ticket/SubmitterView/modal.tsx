import React from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal.tsx";

interface Props {
    detail: React.ReactNode;
    onClose: () => void;
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
`;

const TicketModal: React.FC<Props> = ({detail, onClose}) => {
    return (
        <Modal onClose={onClose}>
            <Wrapper>
                {detail}
            </Wrapper>
        </Modal>
    );
};

export default TicketModal;
