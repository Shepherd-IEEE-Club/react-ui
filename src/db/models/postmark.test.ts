import { TicketModel } from './ticket';
import { PostmarkModel } from './postmark';
import { PostmarkImageModel } from './postmark';

import '../test_sync.ts';

describe('PostmarkModel & PostmarkImageModel', () => {
    it('creates a postmark with images', async () => {
        const postmark = await PostmarkModel.create({
            postmark: 'Testmark',
            town: 'Testville',
            state: 'TS',
            date_seen: '2025-01-01',
            size: 'Medium',
            colors: 'Black, Red',
            adhoc: "{}"
        });

        const image = await PostmarkImageModel.create({
            postmark_id: 1,

            // fixme better data? bs4?
            data: Buffer.from('test-image'),
            thumbnail: 'thumb.png',
        });

        // await postmark.reload();
        const found = await PostmarkModel.findByPk(postmark.id, {
            include: { model: PostmarkImageModel, as: 'images' },
        });

        expect(found).not.toBeNull();
        // @ts-ignore
        expect(found!.images).toBeInstanceOf(Array);
        // @ts-ignore
        expect(found!.images!.length).toBe(1);
        // @ts-ignore
        expect(found!.images![0].thumbnail).toBe('thumb.png');
    });

    // FIXME do we want to cascade? or orphan the images?
    it('deletes postmark images when postmark is deleted (CASCADE)', async () => {
        const postmark = await PostmarkModel.create({
            postmark: 'CascadeMark',
            town: 'DropCity',
            state: 'DC',
        });

        const image = await PostmarkImageModel.create({
            postmark_id: postmark.id,
            data: Buffer.from('cascaded'),
            thumbnail: 'gone.png',
        });

        await postmark.destroy();

        const deletedImage = await PostmarkImageModel.findByPk(image.id);
        expect(deletedImage).toBeNull();
    });
});
