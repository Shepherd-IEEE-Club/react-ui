import React from "react";
import styled from "styled-components";
import { Button } from "@woco/web/pages/Button";

import type { Postmark } from "@woco/schema/postmark";

interface ModalProps {
    postmark?: Postmark;
    onClose: () => void;
}

interface Props {
    postmark: Postmark;
    toggleView: () => void;
}

const Row = styled.div`
  margin-bottom: 0.75rem;
`;

const Label = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const Value = styled.div`
  font-size: 0.95rem;
  color: #333;
`;

const Detail: React.FC<Props> = ({ postmark, toggleView }) => {
    return (
        <>
            <Row>
                <Label>Postmark Name</Label>
                <Value>{postmark.postmark}</Value>
            </Row>
            <Row>
                <Label>Town</Label>
                <Value>{postmark.town}</Value>
            </Row>
            <Row>
                <Label>State</Label>
                <Value>{postmark.state}</Value>
            </Row>
            <Row>
                <Label>Date Seen</Label>
                <Value>{postmark.date_seen}</Value>
            </Row>
            <Row>
                <Label>Size</Label>
                <Value>{postmark.size}</Value>
            </Row>
            <Row>
                <Label>Colors</Label>
                <Value>{postmark.colors}</Value>
            </Row>

            <Button>Revision History</Button>
            <Button onClick={toggleView}>Modify</Button>
        </>
    );
};

export default Detail;
