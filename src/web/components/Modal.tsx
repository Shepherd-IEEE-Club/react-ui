import React, {useEffect} from "react";
import styled from "styled-components";

interface ModalProps {
    onClose?: () => void;
    children: React.ReactNode;
}



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
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                {children}
            </ModalContainer>
    );
};

export default Modal;
