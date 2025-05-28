import React, { useState } from 'react';
import styled from 'styled-components';
import type { Postmark } from "@woco/schema/postmark.ts";
import {useBatchImages} from "@woco/web/hooks/useBatchImages.ts";

interface Props {
    postmark: Postmark
}

const ImageCarousel: React.FC<Props> = ({ postmark }) => {
    const [postmarks, setPostmarks] = useState<Postmark[]>([postmark]);

    useBatchImages(postmarks, () => setPostmarks([...postmarks]));

    const [index, setIndex] = useState(0);


    const images = postmark.images
    console.log(images)

    if (!images || images.length === 0) return null;

    const next = () => setIndex((index + 1) % images.length);
    const prev = () => setIndex((index - 1 + images.length) % images.length);

    return (
        <CarouselContainer>
            <StyledImage
                src={`data:image/jpeg;base64,${images[index].data}`}
            />
            {images.length > 1 && (
                <>
                    <ArrowLeft onClick={prev}>←</ArrowLeft>
                    <ArrowRight onClick={next}>→</ArrowRight>
                    <Counter>{`${index + 1} / ${images.length}`}</Counter>
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
