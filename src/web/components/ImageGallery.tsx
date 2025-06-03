import React, {useEffect, useState} from "react";
import type {ImageMap} from "@woco/schema/postmark.ts";

interface Props {
    imagesPromise: Promise<ImageMap>;
}

export const ImageGallery: React.FC<Props> = ({ imagesPromise }) => {
    const [images, setImages] = useState<ImageMap | null>(null);

    useEffect(() => {
        let isMounted = true;
        imagesPromise.then((map) => {
            if (isMounted) setImages(map);
        });
        return () => {
            isMounted = false;
        };
    }, [imagesPromise]);

    if (!images) return <p>Loading images...</p>;

    return (
        <>
            {Object.values(images)
                .filter((img) => img.postmark_id != null)
                .map((img) => (
                    <img
                        key={img.id}
                        src={`data:image/jpeg;base64,${img.data}`}
                        alt={`Image ${img.id}`}
                        // style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
                    />
                ))}
        </>
    );
};
