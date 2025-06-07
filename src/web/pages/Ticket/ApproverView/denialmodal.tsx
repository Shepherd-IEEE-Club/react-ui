import React, { useState } from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal";
import { Button } from "@woco/web/pages/style.ts";
import type { Ticket } from "@woco/schema/ticket";

// Styled components
const Wrapper = styled.div`
    padding: 1.5rem;
    width: 100%;
    max-width: 600px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const Title = styled.h3`
    font-size: 1.5rem;
    margin: 0;
    color: #333;
`;

const Label = styled.label`
    font-weight: bold;
    margin-bottom: 0.25rem;
    display: block;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    resize: vertical;
    min-height: 120px;
    box-sizing: border-box;
    font-family: sans-serif;
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
`;

interface Props {
    ticket: Ticket;
    onClose: () => void;
    onSubmit: (updatedTicket: Ticket) => void;
}

const DenialReasonModal: React.FC<Props> = ({ ticket, onClose, onSubmit }) => {
    const [reason, setReason] = useState("");

    return (
        <Modal onClose={onClose}>
            <Wrapper>
                <Title>Deny Ticket #{ticket.id}</Title>

                <div>
                    <Label>Denial Reason</Label>
                    <TextArea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Explain why this ticket is being denied…"
                    />
                </div>

                <Actions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            const updatedTicket = { ...ticket, deny_comment: reason };
                            onSubmit(updatedTicket);
                        }}
                    >
                        Submit Denial
                    </Button>
                </Actions>
            </Wrapper>
        </Modal>
    );
};

export default DenialReasonModal;
