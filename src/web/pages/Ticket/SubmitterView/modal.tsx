import React, {useMemo} from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal.tsx";
import Detail from "@woco/web/pages/Ticket/Detail.tsx";
import {PostmarkSchema} from "@woco/schema/postmark.ts";
import type {Ticket} from "@woco/schema/ticket.ts";
import type {z} from "zod";
import {trpc, trpcClient} from "@woco/web/trpc.ts";

interface Props {
    // detail: React.ReactNode;
    ticket: Ticket;
    postmark: z.infer<typeof PostmarkSchema>;
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

const TicketModal: React.FC<Props> = ({ticket, postmark, onClose}) => {
    return (
        <Modal onClose={onClose}>
            <Wrapper>
                <Detail
                    ticket={ticket}
                    postmark={postmark}
                />
            </Wrapper>
        </Modal>
    );
};

export default TicketModal;
