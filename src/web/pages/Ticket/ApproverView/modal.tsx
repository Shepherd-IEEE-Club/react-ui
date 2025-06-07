import React, {useMemo} from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal.tsx";
import {Button} from "@woco/web/pages/style.ts";
import type {Ticket} from "@woco/schema/ticket.ts";
import type {z} from "zod";
import {PostmarkSchema} from "@woco/schema/postmark.ts";
import Detail from "@woco/web/pages/Ticket/Detail.tsx";
import DenialReasonModal from "@woco/web/pages/Ticket/ApproverView/denialmodal.tsx";
import {useApproveTicket} from "@woco/web/hooks/useApproveTicket.ts";
import {useDenyTicket} from "@woco/web/hooks/useDenyTicket.ts";
import {modalManager} from "@woco/web/pages/ModalManager.tsx";
import {trpcClient} from "@woco/web/trpc.ts";

interface Props {
    ticket: Ticket;
    postmark: z.infer<typeof PostmarkSchema>;
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

const TicketModal: React.FC<Props> = ({postmark, ticket}) => {
    const approve = useApproveTicket();
    const deny = useDenyTicket();

    const imageMapPromise = useMemo(() => {
        return trpcClient.tickets.images.query({ticket});
    }, [ticket.id]);

    return (
        <Modal>
            <Wrapper>
                <Detail
                    ticket={ticket}
                    postmark={postmark}
                    imageMapPromise={imageMapPromise}
                />


                <Footer>
                    <DenyButton
                        onClick={() =>
                            modalManager.push(
                                <DenialReasonModal
                                    ticket={ticket}
                                    onClose={modalManager.pop}
                                    onSubmit={(payload) => {
                                        deny.mutate(payload);

                                        // Close this modal and caller
                                        // TODO programmatic way to keep track of modal depth?
                                        modalManager.pop();
                                        modalManager.pop();
                                    }}
                                />
                            )
                        }
                    >
                        Deny
                    </DenyButton>

                    <ApproveButton
                        onClick={() => {
                            approve.mutate({ticket_id: ticket.id});
                            modalManager.pop();
                        }}
                    >
                        Approve
                    </ApproveButton>
                </Footer>
            </Wrapper>
        </Modal>
    );
};

export default TicketModal;
