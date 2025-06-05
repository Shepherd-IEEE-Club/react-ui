import React, { useState } from "react";
import styled from "styled-components";

import { Button } from "@woco/web/pages/style.ts";
import Detail from "./Detail.tsx";
import MakeTicket from "./MakeTicket.tsx";
import ImageCarousel from '@woco/web/components/ImageCarousel.tsx';
import Modal from "@woco/web/components/Modal.tsx"; // ✅

import type {Postmark, ImageMap, PostmarkImageSchema} from "@woco/schema/postmark.ts";
import type {z} from "zod";
import Creation from "@woco/web/pages/Ticket/Creation.tsx";

interface ModalProps {
    postmark: Postmark;
    imageMapPromise: Promise<ImageMap>;
    onClose: () => void;
}

const ImageContainer = styled.div`
    width: 70%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;

    @media (max-width: 768px) {
        width: 100%;
        height: 300px;
    }
`;

const Content = styled.div`
    width: 30%;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
`;

const PostmarkModal: React.FC<ModalProps> = ({ postmark, imageMapPromise, onClose }) => {
    console.log('modal created', imageMapPromise, postmark)
    const [isEditing, setIsEditing] = useState(false);
    const toggleView = () => setIsEditing(prev => !prev);
    const [showTicketModal, setShowTicketModal] = useState(false);


    return showTicketModal ? (
        <Creation
            postmark={postmark}
            images={imageMapPromise}
            onClose={() => setShowTicketModal(false)}
        />
    ) : (
        <Modal onClose={onClose}>
            <ImageContainer>
                <ImageCarousel postmark={postmark} images={imageMapPromise} />
            </ImageContainer>
            <Content>
                <Detail postmark={postmark} images={imageMapPromise} />
                <Button onClick={() => setShowTicketModal(true)}>Create Ticket</Button>
            </Content>
        </Modal>
    );

};

export default PostmarkModal;
