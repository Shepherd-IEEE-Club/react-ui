// @woco/web/components/Modal.tsx
import React from "react";
import styled from "styled-components";

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background: white;
    border-radius: 10px;
    width: 60vw;
    height: 80vh;
    display: flex;
    flex-direction: row;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    overflow: hidden;
`;

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    return (
        <Overlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                {children}
            </ModalContainer>
        </Overlay>
    );
};

export default Modal;
