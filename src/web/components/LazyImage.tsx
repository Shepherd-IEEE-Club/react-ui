import React, {useEffect, useState} from "react";
import type {ImageMap} from "@woco/schema/postmark.ts";
import styled from "styled-components";

interface LazyImageProps {
    imageMapPromise: Promise<ImageMap>;
    imageId: number;
    fallback?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({imageMapPromise, imageId, fallback = ""}) => {
    const [src, setSrc] = useState<string | null>(null);
    console.log(imageMapPromise)

    useEffect(() => {
        let isMounted = true;
        imageMapPromise.then(map => {
            if (isMounted) {
                console.log(map)
                setSrc(map[imageId] ? `data:image/jpeg;base64,${map[imageId].data}` : null);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [imageMapPromise, imageId]);

    // FIXME naughty cant figure out how to not do it like this
    const StyledImg = styled.img`
        width: 100%;
        height: 100%;
        object-fit: contain;
    `;

    return <StyledImg src={src ?? fallback} alt={`Image ${imageId}`} />;

};

export default LazyImage;
