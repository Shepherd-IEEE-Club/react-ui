import React from "react";
import styled from "styled-components";




interface Postmark {
    id?: number;
    image?: string;
    postmark?: string;
    town?: string;
    state?: string;
    date_seen?: string;
    size?: string;
    colors?: string;
}

// TODO
const DUMMY_DATA: Postmark = {
    id: 0,
    image: "", // Add a placeholder image if needed
    postmark: "Example Postmark",
    town: "Sample Town",
    state: "Sample State",
    date_seen: "N/A",
    size: "N/A",
    colors: "N/A",
};

interface ModalProps {
    postmark?: Postmark;
    onClose: () => void;
}



// FIXME use flexbox isnteaf of hard percent
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background: white;
    border-radius: 10px;
    width: 60vw;
    //max-width: 800px;
    height: 80vh;
    display: flex;
    flex-direction: row;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    overflow: hidden;

`;

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

const Image = styled.img`
    width: 100%;
    height: auto;
    max-height: 100%;
    object-fit: contain;
    border-radius: 6px;
`;

const Content = styled.div`
    width: 30%;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    //@media (max-width: 768px) {
    //    width: 100%;
    //}
`;

const Title = styled.h3`
    margin-bottom: 1rem;
    text-align: center;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.75rem;
`;

const Label = styled.label`
    font-size: 0.9rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const Select = styled.select`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const CloseButton = styled.button`
    background: #d9534f;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 1rem;
    font-size: 1rem;
    align-self: center;
    transition: background 0.2s ease-in-out;

    &:hover {
        background: #c9302c;
    }
`;

const PostmarkModal: React.FC<ModalProps> = ({ postmark = DUMMY_DATA, onClose }) => {
    return (
        <Overlay>
            <ModalContainer>
                <ImageContainer>
                    <Image src={`data:image/jpeg;base64,${postmark.image}`} alt={postmark.postmark} />
                </ImageContainer>
                <Content>
                    <Title>Postmark Details</Title>

                    <FormGroup>
                        <Label>Postmark Name</Label>
                        <Input type="text" defaultValue={postmark.postmark} />
                    </FormGroup>

                    <FormGroup>
                        <Label>Town</Label>
                        <Input type="text" defaultValue={postmark.town} />
                    </FormGroup>

                    <FormGroup>
                        <Label>State</Label>
                        <Input type="text" defaultValue={postmark.state} />
                    </FormGroup>

                    <FormGroup>
                        <Label>Years Seen (if range)</Label>
                        <Input type="text" defaultValue={postmark.date_seen} />
                    </FormGroup>

                    <FormGroup>
                        <Label>Earliest Use</Label>
                        <Input type="text" placeholder="Enter earliest use date" />
                    </FormGroup>

                    <FormGroup>
                        <Label>Latest Use</Label>
                        <Input type="text" placeholder="Enter latest use date" />
                    </FormGroup>

                    <FormGroup>
                        <Label>Color(s)</Label>
                        <Select multiple>
                            <option value="Red">Red</option>
                            <option value="Blue">Blue</option>
                            <option value="Green">Green</option>
                            <option value="Black">Black</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label>Townmark Shape</Label>
                        <Input type="text" placeholder="Enter shape" />
                    </FormGroup>

                    <FormGroup>
                        <Label>Email</Label>
                        <Input type="email" placeholder="Enter your email" />
                    </FormGroup>

                    <FormGroup>
                        <Label>Would you like to receive an email after the admin has seen it?</Label>
                        <Select>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Select>
                    </FormGroup>

                    <CloseButton onClick={onClose}>Close</CloseButton>
                </Content>
            </ModalContainer>
        </Overlay>
    );
};

export default PostmarkModal;
