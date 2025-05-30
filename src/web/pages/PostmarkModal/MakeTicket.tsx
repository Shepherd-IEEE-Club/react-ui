import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@woco/web/pages/style.ts';
import { EditableField } from './EditableField.tsx';
import type { Postmark } from '@woco/schema/postmark.ts';



interface Props {
    postmark: Postmark;
    onEdit: () => void;
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
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 0.25rem;
`;

const Input = styled.input`
  font-size: 0.95rem;
  padding: 0.5rem;
  width: 100%;
`;

const Select = styled.select`
  font-size: 0.95rem;
  padding: 0.5rem;
  width: 100%;
`;




const MakeTicket: React.FC<Props> = ({ postmark, onEdit }) => {
    const [formData, setFormData] = useState({
        postmark: postmark.postmark || '',
        town: postmark.town || '',
        state: postmark.state || '',
        date_seen: postmark.date_seen || '',
        size: postmark.size || '',
        colors: postmark.colors || '',
    });

    return (
        <>
            <EditableField
                label="Postmark Name"
                oldValue={postmark.postmark}
                newValue={formData.postmark}
            >
                <Input
                    type="text"
                    value={formData.postmark}
                    onChange={(e) => setFormData({ ...formData, postmark: e.target.value })}
                />
            </EditableField>

            <EditableField
                label="Town"
                oldValue={postmark.town}
                newValue={formData.town}
            >
                <Input
                    type="text"
                    value={formData.town}
                    onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                />
            </EditableField>

            <EditableField
                label="State"
                oldValue={postmark.state}
                newValue={formData.state}
            >
                <Select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                    <option value="">Select a state</option>
                    <option value="WV">West Virginia</option>
                    <option value="VA">Virginia</option>
                    <option value="PA">Pennsylvania</option>
                    {/* Add more */}
                </Select>
            </EditableField>

            <EditableField
                label="Date Seen"
                oldValue={postmark.date_seen}
                newValue={formData.date_seen}
            >
                <Input
                    type="date"
                    value={formData.date_seen}
                    onChange={(e) => setFormData({ ...formData, date_seen: e.target.value })}
                />
            </EditableField>
            {/*FIXME naughty nonconforming dates*/}

            <EditableField
                label="Size"
                oldValue={postmark.size}
                newValue={formData.size}
            >
                <Input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                />
            </EditableField>

            <EditableField
                label="Colors"
                oldValue={postmark.colors}
                newValue={formData.colors}
            >
                <Input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                />
            </EditableField>
            {/*TODO comment field*/}

            <Button>Save</Button>
            <Button onClick={onEdit}>Cancel</Button>
        </>
    );
};


export default MakeTicket;
