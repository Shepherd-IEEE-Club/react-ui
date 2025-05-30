import React from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal.tsx";
import {Button} from "@woco/web/pages/style.ts";

interface Props {
    detail: React.ReactNode;
    onClose: () => void;
    onApprove?: () => void;
    onDeny?: () => void;
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
`;

const Footer = styled.div`
    display: flex;
    justify-content: center; // centers the button row
    gap: 3rem; // spacing between buttons
    margin-top: 2rem;
`;


const ApproveButton = styled(Button)`
    background-color: #28a745;
    color: white;
`;

const DenyButton = styled(Button)`
    background-color: #dc3545;
    color: white;
`;

const TicketModal: React.FC<Props> = ({detail, onClose, onApprove, onDeny}) => {
    return (
        <Modal onClose={onClose}>
            <Wrapper>
                {detail}

                {(onApprove || onDeny) && (
                    <Footer>
                        {onDeny && <DenyButton onClick={onDeny}>Deny</DenyButton>}
                        {onApprove && <ApproveButton onClick={onApprove}>Approve</ApproveButton>}
                    </Footer>
                )}
            </Wrapper>
        </Modal>
    );
};

export default TicketModal;
