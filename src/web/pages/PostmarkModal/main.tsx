import React, {useState} from "react";
import styled from "styled-components";

import {Button} from "@woco/web/pages/Button";
import Detail from "./Detail";
import MakeTicket from "./MakeTicket";


import type {Postmark} from "@woco/schema/postmark";

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


const Main: React.FC<ModalProps> = ({postmark, onClose}) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleView = () => setIsEditing((prev) => !prev);


    return (
        <Overlay>
            <ModalContainer>
                <ImageContainer>
                    <Image src={`data:image/jpeg;base64,${postmark.image}`} alt={postmark.postmark}/>
                </ImageContainer>
                <Content>
                    <Button onClick={() => {
                        console.log('Button clicked');
                        toggleView();
                    }}>Modify</Button>

                    {isEditing ? (
                        <MakeTicket postmark={postmark} toggleview={toggleView}/>
                    ) : (
                        <Detail postmark={postmark} toggleView={toggleView}/>
                    )}
                </Content>
            </ModalContainer>
        </Overlay>
    );
};

export default Main;