import React from "react";
import styled from "styled-components";
import Modal from "@woco/web/components/Modal.tsx";
import type {Ticket} from "@woco/schema/ticket.ts";
import type {z} from "zod";
import type {PostmarkSchema, PostmarkImageSchema} from "@woco/schema/postmark.ts";
import {TICKET_STATUS_LABELS} from "@woco/web/constants.ts";


interface Props {
    postmark: z.infer<typeof PostmarkSchema>;
    images: Record<number, z.infer<typeof PostmarkImageSchema>>;
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



const Row = styled.div`
    display: grid;
    grid-template-columns: 150px 1fr 1fr;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #ddd;
    align-items: start;
    width: 100%;
    box-sizing: border-box;
`;

const Header = styled(Row)`
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

const Detail: React.FC<Props> = ({postmark, images}) => {
    // const changes = ticket.changes ?? {};

    // FIXME
    const postmarkEntries = Object.entries(postmark).filter(
        ([key]) => key !== "id" && key !== "image"
    );


    return (
        <Section>
            <Header>
                <div>Field</div>
                <div>Current</div>
            </Header>
            {postmarkEntries.map(([key, currentVal]) => {
                return (
                    <Row key={key}>
                        <div style={{fontWeight: 600}}>{key}</div>
                        <div>{currentVal ?? <em>None</em>}</div>
                    </Row>
                );
            })}

            <Row>
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

            </Row>
        </Section>
    );
};
// TODO inspect image modal


export default Detail;
