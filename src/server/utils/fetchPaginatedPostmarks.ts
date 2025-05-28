import { Sequelize } from 'sequelize';
import { PostmarkModel, PostmarkImageModel } from '@woco/db/models/postmark';
import { z } from 'zod';

export const PostmarkFilterSchema = z.object({
    limit: z.number().min(1).max(10000).default(50),
    cursor: z.number().nullish(),
});

export type PostmarkFilterInput = z.infer<typeof PostmarkFilterSchema>;

export function buildPostmarkWhereClause(input: PostmarkFilterInput): Record<string, any> {
    const where: Record<string, any> = {};

    // TODO filtering stuff here if so desired

    if (input.cursor) {
        where.id = { [Sequelize.Op.gt]: input.cursor };
    }

    return where;
}

export async function fetchPaginatedPostmarks(input: PostmarkFilterInput) {
    const PAGE_SIZE = input.limit;
    const where = buildPostmarkWhereClause(input);

    const rows = await PostmarkModel.findAll({
        where,
        order: [['id', 'ASC']],
        limit: PAGE_SIZE + 1,
        attributes: ['id', 'postmark', 'town', 'state', 'date_seen'],
        include: [
            {
                model: PostmarkImageModel,
                as: 'images',
                attributes: ['id', 'thumbnail'],
                separate: true,
            },
        ],
    });

    let nextCursor: number | undefined = undefined;
    if (rows.length > PAGE_SIZE) {
        const next = rows.pop();
        nextCursor = next!.id;
    }

    return {
        items: rows.map((r) => ({
            ...r.toJSON(),
            imageIds: r.images.map((img) => img.id),
        })),
        nextCursor,
    };
}