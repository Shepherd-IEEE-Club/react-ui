import React from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal";
import type { Ticket } from "@woco/schema/ticket";
import type { z } from "zod";
import type { PostmarkSchema } from "@woco/schema/postmark";

interface Props {
    ticket: Ticket;
    postmark: z.infer<typeof PostmarkSchema.withThumbnail>;
    onClose: () => void;
}

const Section = styled.div`
    padding: 1rem;
`;

const TicketModal: React.FC<Props> = ({ ticket, postmark, onClose }) => {
    return (
        <Modal onClose={onClose}>
            <Section>
                <h3>Ticket #{ticket.id}</h3>
                <p>Status: {ticket.status_id}</p>
                <p>User ID: {ticket.user_id}</p>
                <p>Comment: {ticket.comment}</p>
                <p>Created: {new Date(ticket.created_at).toLocaleString()}</p>
                <hr />
                <h4>Postmark Info</h4>
                <p>{postmark.postmark} — {postmark.town}, {postmark.state}</p>
                {postmark.images?.[0]?.thumbnail && (
                    <img
                        src={`data:image/jpeg;base64,${postmark.images[0].thumbnail}`}
                        alt="thumbnail"
                        style={{ width: 200, borderRadius: 6 }}
                    />
                )}
            </Section>
        </Modal>
    );
};

export default TicketModal;
