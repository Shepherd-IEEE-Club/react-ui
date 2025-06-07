import React, {useState} from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal.tsx";
import type {Ticket} from "@woco/schema/ticket.ts";
import type {z} from "zod";
import type {PostmarkSchema, PostmarkImageSchema, ImageMap} from "@woco/schema/postmark.ts";
import {TICKET_STATUS_LABELS} from "@woco/web/constants.ts";
import {Button} from "@woco/web/pages/style.ts";
import {trpc} from "@woco/web/trpc.ts";


interface Props {
    ticket?: Ticket | null; // Optionally pass in existing ticket
    postmark: z.infer<typeof PostmarkSchema>;
    images: Promise<ImageMap>;
    onClose: () => void;
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


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
`;


const Detail: React.FC<Props> = ({ticket, postmark, images, onClose}) => {
    // const changes = ticket.changes ?? {};
    const [changes, setChanges] = useState<Record<string, any>>(ticket?.changes ?? {});


    // FIXME
    const postmarkEntries = Object.entries(postmark).filter(
        ([key]) => key !== "id" && key !== "image"
    );


    const createTicket = trpc.tickets.create.useMutation();

    const newTicket = ticket ?? {
        user_id: 1,
        postmark_id: postmark.id,
        // status_id: 1,
        changes: {},
    };



    return (
        <Modal onClose={onClose}>
            <Wrapper>

                <Section>
                    {/*<h3>Ticket #{ticket.id}</h3>*/}
                    {/*<p>Status: {TICKET_STATUS_LABELS[ticket.status_id]}</p>*/}
                    {/*<p>User ID: {ticket.user_id}</p>*/}
                    {/*<p>Comment: {ticket.comment}</p>*/}
                    {/*<p>Created: {new Date(ticket.created_at).toLocaleString()}</p>*/}

                    {/*/!*TODO*!/*/}
                    {/*{ticket.deny_comment && (*/}
                    {/*    <p style={{color: 'darkred', fontWeight: 'bold'}}>*/}
                    {/*        Denial Reason: {ticket.deny_comment}*/}
                    {/*    </p>*/}
                    {/*)}*/}

                    <hr/>
                    <h4>Postmark Comparison</h4>

                    <ComparisonHeader>
                        <div>Field</div>
                        <div>Current</div>
                        <div>Proposed</div>
                    </ComparisonHeader>
                    <ComparisonRow>
                        <div style={{fontWeight: 600}}>Postmark</div>
                        <div>{postmark.postmark ?? <em>None</em>}</div>
                        <div>
                            <input
                                type="text"
                                value={changes.postmark ?? ""}
                                onChange={(e) => {
                                    setChanges((prev) => ({...prev, postmark: e.target.value}))
                                }}
                            />
                        </div>
                    </ComparisonRow>

                    <ComparisonRow>
                        <div style={{fontWeight: 600}}>Town</div>
                        <div>{postmark.town ?? <em>None</em>}</div>
                        <div>
                            <input
                                type="text"
                                value={changes.town ?? ""}
                                onChange={(e) => {
                                    setChanges((prev) => ({...prev, town: e.target.value}))
                                }}
                            />
                        </div>
                    </ComparisonRow>

                    {/*FIXME get from db*/}
                    <ComparisonRow>
                        <div style={{fontWeight: 600}}>State</div>
                        <div>{postmark.state ?? <em>None</em>}</div>
                        <div>
                            <select
                                value={changes.state ?? ""}
                                onChange={(e) => {
                                    setChanges((prev) => ({...prev, state: e.target.value}));
                                }}
                            >
                                <option value="">Select...</option>
                                {["AL", "AK", "AZ", "AR", "CA", "CO", "WV"].map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </ComparisonRow>

                    <ComparisonRow>
                        <div style={{fontWeight: 600}}>Date Seen</div>
                        <div>{postmark.date_seen ?? <em>None</em>}</div>
                        <div>
                            <input
                                type="date"
                                value={changes.date_seen ?? ""}
                                onChange={(e) => setChanges((prev) => ({...prev, date_seen: e.target.value}))}
                            />
                        </div>
                    </ComparisonRow>

                    <ComparisonRow>
                        <div style={{fontWeight: 600}}>Size</div>
                        <div>{postmark.size ?? <em>None</em>}</div>
                        <div>
                            <select
                                value={changes.size ?? ""}
                                onChange={(e) => setChanges((prev) => ({...prev, size: e.target.value}))}
                            >
                                <option value="">Select...</option>
                                {["small", "medium", "large"].map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </ComparisonRow>

                    <ComparisonRow>
                        <div style={{fontWeight: 600}}>Colors</div>
                        <div>{postmark.colors ?? <em>None</em>}</div>
                        <div>
                            <input
                                type="text"
                                value={changes.colors ?? ""}
                                onChange={(e) => setChanges((prev) => ({...prev, colors: e.target.value}))}
                            />
                        </div>
                    </ComparisonRow>


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
                        {/*FIXME implement uploading removing images*/}
                        {/*<ImageList>*/}
                        {/*    {Object.values(images).map((img) => {*/}
                        {/*        // if image is in the removal list, its being removed*/}
                        {/*        const isRemoved = ticket.changes.remove_images?.includes(img.id)*/}
                        {/*        console.log(images)*/}
                        {/*        // if image has a ticket id, it has yet to be added*/}
                        {/*        const isAdded = img.ticket_id != null;*/}

                        {/*        return (*/}
                        {/*            <StyledImage*/}
                        {/*                key={img.id}*/}
                        {/*                src={`data:image/jpeg;base64,${img.data}`}*/}
                        {/*                alt={`Proposed Image ${img.id}`}*/}
                        {/*                $added={isAdded}*/}
                        {/*                $removed={isRemoved}*/}
                        {/*            />*/}
                        {/*        );*/}
                        {/*    })}*/}
                        {/*</ImageList>*/}
                    </ComparisonRow>

                    <hr/>
                    <div style={{marginTop: "1.5rem"}}>
                        <Button
                            onClick={() => {
                                console.log("Submitting changes:", changes);
                                createTicket.mutate({
                                    user_id: newTicket.user_id,
                                    postmark_id: newTicket.postmark_id,
                                    // comment: ticket.comment,
                                    changes,
                                    // status_id: 1, // or whatever you want
                                });

                            }}
                        >
                            Submit Changes
                        </Button>
                    </div>

                </Section>
            </Wrapper>
        </Modal>
    );
};
// TODO inspect image modal


export default Detail;
