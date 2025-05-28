import React, { useState } from "react";
import styled from "styled-components";

import { Button } from "@woco/web/pages/Button.ts";
import Detail from "./Detail.tsx";
import MakeTicket from "./MakeTicket.tsx";
import ImageCarousel from '@woco/web/components/ImageCarousel.tsx';
import Modal from "@woco/web/components/Modal.tsx"; // ✅

import type { Postmark } from "@woco/schema/postmark.ts";

interface ModalProps {
    postmark?: Postmark;
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

const PostmarkModal: React.FC<ModalProps> = ({ postmark, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleView = () => setIsEditing(prev => !prev);

    return (
        <Modal onClose={onClose}>
            <ImageContainer>
                <ImageCarousel postmark={postmark} />
            </ImageContainer>
            <Content>
                <Button onClick={toggleView}>Modify</Button>
                {isEditing ? (
                    <MakeTicket postmark={postmark} toggleview={toggleView} />
                ) : (
                    <Detail postmark={postmark} toggleView={toggleView} />
                )}
            </Content>
        </Modal>
    );
};

export default PostmarkModal;
