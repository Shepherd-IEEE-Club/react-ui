import styled from "styled-components";

// noinspection CssUnresolvedCustomProperty

export const Button = styled.button`
    padding: 0.5rem 1rem;


    background-color: var(
            --button-color,
            #007bff
    );
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: filter 0.2s ease;

    &:hover {
        filter: brightness(1.1);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;


export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
`;