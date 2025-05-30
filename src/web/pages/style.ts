import styled from "styled-components";

export const Button = styled.button`
    padding: 0.5rem 1rem;
    background-color: var(--button-color, #007bff); // ✅ fixed
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: filter 0.2s ease;

    &:hover {
        filter: brightness(1.1);
    }
`;
