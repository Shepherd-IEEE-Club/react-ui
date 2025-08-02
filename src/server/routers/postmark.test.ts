import { postmarksRouter } from './postmark';
import { PostmarkModel, PostmarkImageModel } from '@woco/db/models/postmark';
import { Sequelize } from 'sequelize';
import { z } from 'zod';

let caller: ReturnType<typeof postmarksRouter.createCaller>;

beforeAll(async () => {
    // Optionally: reset in-memory SQLite
    const { sequelize } = await import('@woco/db/client'); // assumes `client.ts` exports sequelize
    await sequelize.sync({ force: true });

    // Insert seed data
    const postmark = await PostmarkModel.create({
        id: 1,
        postmark: 'NYC',
        town: 'New York',
        state: 'NY',
        date_seen: '2023-01-01',
    });

    await PostmarkImageModel.bulkCreate([
        {
            postmark_id: postmark.id,
            thumbnail: "fortnite",
            data: "burger",
        },
        {
            postmark_id: postmark.id,
            thumbnail: "skibiti",
            data: "toilet",
        },
    ]);

    // Setup tRPC caller
    caller = postmarksRouter.createCaller({});
});

describe('postmarksRouter', () => {

    // TODO test pagination
    // TODO test filtering

    // test thumbnails
    test('infinite ', async () => {
        const result = await caller.infinite({ limit: 10 });

        expect(result.items.length).toBeGreaterThan(0);


        expect(result.items[0]!.images[0]!.thumbnail).toBeTruthy();
    });


    test('images returns full base64-encoded data', async () => {
        const result = await caller.images({ id: 1 });
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('data');
        // @ts-ignore
        expect(typeof result[0].data).toBe('string');
        // @ts-ignore
        // expect(result[0].data).toBe(Buffer.from('image1').toString('base64'));
    });
});
