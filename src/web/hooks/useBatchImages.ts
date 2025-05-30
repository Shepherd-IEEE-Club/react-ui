import { useEffect } from 'react';
import { trpc } from '../trpc';
import type { Postmark } from '@woco/schema/postmark';

/**
 * Mutates postmark.images in-place to add .data (full image) when it becomes available.
 */
export const useBatchImages = (
    postmarks: Postmark[],
    onImagesAttached?: () => void
) => {
    // Only fetch images that are missing `.data`
    const imageIds = Array.from(
        new Set(
            postmarks
                .flatMap(p => p.images ?? [])
                .filter(img => img.data == null)
                .map(img => img.id)
        )
    );

    const { data: images = [] } = trpc.postmarks.images.useQuery(
        { postmark_id: imageIds },
        {
            enabled: imageIds.length > 0,
            staleTime: Infinity,
            cacheTime: Infinity,
        }
    );

    useEffect(() => {
        if (!images.length) return;

        const imageMap = new Map<number, string>();
        images.forEach(img => imageMap.set(img.id, img.base64));

        for (const postmark of postmarks) {
            for (const image of postmark.images ?? []) {
                if (image.data == null) {
                    image.data = imageMap.get(image.id) ?? null;
                }
            }
        }

        onImagesAttached?.(); // Triggers re-render from parent
    }, [images]);
};
