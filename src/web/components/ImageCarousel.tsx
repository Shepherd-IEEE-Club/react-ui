import React, { useState } from 'react';
import styled from 'styled-components';
import type {ImageMap, Postmark} from "@woco/schema/postmark.ts";

interface Props {
    postmark: Postmark
    images: ImageMap
}

const ImageCarousel: React.FC<Props> = ({ postmark, images }) => {
    const [index, setIndex] = useState(0);
    const imageArray = Object.values(images);
    const next = () => setIndex((index + 1) % imageArray.length);
    const prev = () => setIndex((index - 1 + imageArray.length) % imageArray.length);

    return (
        <CarouselContainer>
            <StyledImage
                src={`data:image/jpeg;base64,${images[index].data}`}
            />
            {imageArray.length > 1 && (
                <>
                    <ArrowLeft onClick={prev}>←</ArrowLeft>
                    <ArrowRight onClick={next}>→</ArrowRight>
                    <Counter>{`${index + 1} / ${imageArray.length}`}</Counter>
                </>
            )}
        </CarouselContainer>
    );
};

export default ImageCarousel;

// --- Styled Components ---
const CarouselContainer = styled.div`
    position: relative;
    width: 100%;
    height: auto;
`;

const StyledImage = styled.img`
    width: 100%;
    max-height: 400px;
    object-fit: contain;
`;

const ArrowLeft = styled.button`
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.4);
    color: white;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    z-index: 1;
`;

const ArrowRight = styled(ArrowLeft)`
    left: auto;
    right: 10px;
`;

const Counter = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0,0,0,0.6);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    font-size: 0.9rem;
`;
