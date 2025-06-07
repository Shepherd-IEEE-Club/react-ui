import React, {useMemo} from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal.tsx";
import Detail from "@woco/web/pages/Ticket/Detail.tsx";
import {PostmarkSchema} from "@woco/schema/postmark.ts";
import type {Ticket} from "@woco/schema/ticket.ts";
import type {z} from "zod";
import {modalManager} from "@woco/web/pages/ModalManager.tsx";
import OkPopup from "@woco/web/components/OkPopup.tsx";
import {Button} from "@woco/web/pages/style.ts";
import Creation from "@woco/web/pages/Ticket/Creation.tsx";
import {trpcClient} from "@woco/web/trpc.ts";

interface Props {
    ticket: Ticket;
    postmark: z.infer<typeof PostmarkSchema>;
}

const Wrapper = styled.div`
    //display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
`;

const TicketModal: React.FC<Props> = ({ticket, postmark}) => {
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

                {ticket.status_id === 3 && (
                    <Button
                        onClick={() => {
                            // pass in the ticket, since we are recomposing
                            modalManager.push(
                                <Creation
                                    ticket={ticket}
                                    postmark={postmark}
                                    imageMapPromise={imageMapPromise}
                                >
                                </Creation>
                            )
                        }}
                    >
                        Recompose Ticket
                    </Button>
                )}
            </Wrapper>
        </Modal>
    );
};

export default TicketModal;
