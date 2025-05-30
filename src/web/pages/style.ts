import styled from "styled-components";
import { lighten } from "polished";

export const Button = styled.button`
    padding: 0.5rem 1rem;
    background-color: var(0, #007bff);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: filter 0.2s ease;

    // Lighten on hover no matter what color it is 
    &:hover {
        filter: brightness(1.1);
    }
`;
