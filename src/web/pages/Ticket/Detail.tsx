import React from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal.tsx";
import type {Ticket} from "@woco/schema/ticket.ts";
import type {z} from "zod";
import type {PostmarkSchema, PostmarkImageSchema, ImageMap} from "@woco/schema/postmark.ts";
import {TICKET_STATUS_LABELS} from "@woco/web/constants.ts";


interface Props {
    ticket: Ticket;
    postmark: z.infer<typeof PostmarkSchema>;
    images: Promise<ImageMap>;
}

const Block = styled.div`
    margin: 1.5rem 0;
`;

const ImageComparison = styled.div`
    display: flex;
    gap: 2rem;
    width: 100%;
`;

const ImageList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: 100%;
    box-sizing: border-box;
`;


const Label = styled.div`
    font-weight: 600;
    color: #444;
`;

const Value = styled.div`
    color: #222;
`;




const Section = styled.div`
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 1.5rem;
`;



const ComparisonRow = styled.div`
    display: grid;
    grid-template-columns: 150px 1fr 1fr;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #ddd;
    align-items: start;
    width: 100%;
    box-sizing: border-box;
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


const StyledImage = styled.img<{ $removed?: boolean; $added?: boolean }>`
    width: 100px;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    opacity: ${({$removed}) => ($removed ? 0.4 : 1)};
    border: 2px solid ${({$added, $removed}) =>
            $added ? "green" : $removed ? "red" : "transparent"};
`;

const Detail: React.FC<Props> = ({ticket, postmark, images}) => {
    const changes = ticket.changes ?? {};

    // FIXME
    const postmarkEntries = Object.entries(postmark).filter(
        ([key]) => key !== "id" && key !== "image"
    );


    return (
            <Section>
                <h3>Ticket #{ticket.id}</h3>
                <p>Status: {TICKET_STATUS_LABELS[ticket.status_id]}</p>
                <p>User ID: {ticket.user_id}</p>
                <p>Comment: {ticket.comment}</p>
                <p>Created: {new Date(ticket.created_at).toLocaleString()}</p>

                {/*TODO*/}
                {ticket.deny_comment && (
                    <p style={{ color: 'darkred', fontWeight: 'bold' }}>
                        Denial Reason: {ticket.deny_comment}
                    </p>
                )}

                <hr/>
                <h4>Postmark Comparison</h4>

                <ComparisonHeader>
                    <div>Field</div>
                    <div>Current</div>
                    <div>Proposed</div>
                </ComparisonHeader>

                {/*FIXME*/}

                {postmarkEntries.map(([key, currentVal]) => {
                    const proposedVal = (changes as any)?.[key];
                    const changed =
                        proposedVal !== undefined && proposedVal !== currentVal;

                    return (
                        <ComparisonRow key={key}>
                            <div style={{fontWeight: 600}}>{key}</div>
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
                    <div style={{fontWeight: 600}}>images</div>

                    {/*FIXME ensure proper order*/}
                    <ImageList>
                        {Object.values(images)
                            .filter((img) => img.postmark_id != null)
                            .map((img) => (
                                <StyledImage
                                    key={img.id}
                                    src={`data:image/jpeg;base64,${img.data}`}
                                />
                            ))}
                    </ImageList>

                    <ImageList>
                        {Object.values(images).map((img) => {
                            // if image is in the removal list, its being removed
                            const isRemoved = ticket.changes.remove_images?.includes(img.id)
                            console.log(images)
                            // if image has a ticket id, it has yet to be added
                            const isAdded = img.ticket_id != null;

                            return (
                                <StyledImage
                                    key={img.id}
                                    src={`data:image/jpeg;base64,${img.data}`}
                                    alt={`Proposed Image ${img.id}`}
                                    $added={isAdded}
                                    $removed={isRemoved}
                                />
                            );
                        })}
                    </ImageList>
                </ComparisonRow>
            </Section>
    );
};
// TODO inspect image modal


export default Detail;
