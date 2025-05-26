import React from 'react';
import styled from 'styled-components';

const Row = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const Value = styled.div`
  font-size: 1rem;
  color: black;
  margin-bottom: 0.25rem;
`;

interface Props {
    label: string;
    oldValue: string | undefined;
    newValue: string | undefined;
    children: React.ReactNode;
}

export const EditableField: React.FC<Props> = ({ label, oldValue, newValue, children }) => {
    const changed = oldValue !== newValue;

    return (
        <Row>
            <Label>{label}</Label>
            {children}
            {changed && <Value>Current: {oldValue || '—'}</Value>}
        </Row>
    );
};

//FIXME style?
// animation?