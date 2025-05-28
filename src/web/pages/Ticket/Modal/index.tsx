import React from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal";
import type { Ticket } from "@woco/schema/ticket";
import type { z } from "zod";
import type { PostmarkSchema, FullImageSchema} from "@woco/schema/postmark";

interface Props {
    ticket: Ticket;
    postmark: z.infer<typeof PostmarkSchema>;
    images: Record<number, z.infer<typeof FullImageSchema>>;
    onClose: () => void;
}

const Section = styled.div`
    padding: 1rem;
`;

const TicketModal: React.FC<Props> = ({ ticket, postmark, images, onClose }) => {
    return (
        <Modal onClose={onClose}>
            <Section>
                <h3>Ticket #{ticket.id}</h3>
                <p>Status: {ticket.status_id}</p>
                <p>User ID: {ticket.user_id}</p>
                <p>Comment: {ticket.comment}</p>
                <p>Created: {new Date(ticket.created_at).toLocaleString()}</p>
                <hr/>
                <h4>Postmark Info</h4>
                <p>{postmark.postmark} — {postmark.town}, {postmark.state}</p>


                <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem'}}>
                    {Object.values(images).map((img) => (
                        <img
                            key={img.id}
                            src={`data:image/jpeg;base64,${img.data}`}
                            alt={`Image ${img.id}`}
                            style={{width: 200, borderRadius: 6}}
                        />
                    ))}
                </div>
            </Section>
        </Modal>
    );
};

export default TicketModal;
