import React from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal";
import type { Ticket } from "@woco/schema/ticket";
import type { z } from "zod";
import type { PostmarkSchema, FullImageSchema } from "@woco/schema/postmark";

interface Props {
    ticket: Ticket;
    postmark: z.infer<typeof PostmarkSchema>;
    images: Record<number, z.infer<typeof FullImageSchema>>;
    onClose: () => void;
}

const Section = styled.div`
    padding: 1.5rem;
    font-family: sans-serif;
`;

const ComparisonRow = styled.div`
    display: grid;
    grid-template-columns: 150px 1fr 1fr;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #ddd;
    align-items: start;
`;

const ComparisonHeader = styled(ComparisonRow)`
    font-weight: bold;
    background: #f8f8f8;
    border-top: 1px solid #ccc;
    border-bottom: 2px solid #ccc;
    margin-top: 1rem;
`;

const ChangedCell = styled.div`
    background-color: #fff5cc;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
`;

const ImageList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const StyledImage = styled.img<{ $removed?: boolean; $added?: boolean }>`
    width: 100px;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    opacity: ${({ $removed }) => ($removed ? 0.4 : 1)};
    border: 2px solid
    ${({ $added, $removed }) =>
            $added ? "green" : $removed ? "red" : "transparent"};
`;

const TicketModal: React.FC<Props> = ({ ticket, postmark, images, onClose }) => {
    const changes = ticket.changes ?? {};
    const postmarkEntries = Object.entries(postmark).filter(
        ([key]) => key !== "id" && key !== "image"
    );

    const removeIds = new Set(ticket.changes?.images?.remove ?? []);
    const addIds = new Set(ticket.changes?.images?.add ?? []);

    const allCurrentImages = Object.values(images).filter((img) => !addIds.has(img.id));
    const proposedImages = [
        ...Object.values(images).filter((img) => !removeIds.has(img.id)),
        ...Array.from(addIds)
            .filter((id) => images[id])
            .map((id) => images[id]),
    ];
    console.log(changes);

    return (
        <Modal onClose={onClose}>
            <Section>
                <h3>Ticket #{ticket.id}</h3>
                <p>Status: {ticket.status_id}</p>
                <p>User ID: {ticket.user_id}</p>
                <p>Comment: {ticket.comment}</p>
                <p>Created: {new Date(ticket.created_at).toLocaleString()}</p>

                <hr />
                <h4>Postmark Comparison</h4>

                <ComparisonHeader>
                    <div>Field</div>
                    <div>Current</div>
                    <div>Proposed</div>
                </ComparisonHeader>

                {postmarkEntries.map(([key, currentVal]) => {
                    const proposedVal = (changes as any)?.[key];
                    const changed =
                        proposedVal !== undefined && proposedVal !== currentVal;

                    return (
                        <ComparisonRow key={key}>
                            <div style={{ fontWeight: 600 }}>{key}</div>
                            <div>{currentVal ?? <em>None</em>}</div>
                            <div>
                                {changed ? (
                                    <ChangedCell>{proposedVal}</ChangedCell>
                                ) : (
                                    ""
                                )}
                            </div>
                        </ComparisonRow>
                    );
                })}

                <ComparisonRow>
                    <div style={{ fontWeight: 600 }}>images</div>
                    <ImageList>
                        {allCurrentImages.map((img) => (
                            <StyledImage
                                key={img.id}
                                src={`data:image/jpeg;base64,${img.data}`}
                                alt={`Current Image ${img.id}`}
                                $removed={removeIds.has(img.id)}
                            />
                        ))}
                    </ImageList>
                    <ImageList>
                        {proposedImages.map((img) => (
                            <StyledImage
                                key={img.id}
                                src={`data:image/jpeg;base64,${img.data}`}
                                alt={`Proposed Image ${img.id}`}
                                $added={addIds.has(img.id)}
                            />
                        ))}
                    </ImageList>
                </ComparisonRow>
            </Section>
        </Modal>
    );
};

export default TicketModal;
