import { UserModel } from './user';
import { PostmarkModel } from './postmark';
import { TicketModel } from './ticket';
import { TicketStatusModel } from './ticket';
import '../test_sync.ts';

describe('ticket table', () => {
    it('creates ticket row with all FKs wired', async () => {
        // user who files the ticket
        const user = await UserModel.create({ name: 'jared', email: 'jared@fortnite.com' });

        // postmark the ticket is about
        const postmark = await PostmarkModel.create({
            postmark: 'Fortnite PM',
            town: 'Tilted Towers',
            state: 'WV',
        });

        // ticket status row (needs its own user_id FK)
        const status = await TicketStatusModel.create({
            id: 1,                     // no auto-increment on this table
            name: 'open',
            user_id: user.id,
        });

        // create the actual ticket
        const ticket = await TicketModel.create({
            postmark_id: postmark.id,
            user_id: user.id,
            status_id: status.id,
            changes: { foo: 'bar' },
            comment: null,
            deny_comment: null,
        });

        // fetch back with associations
        const found = await TicketModel.findOne({
            where: { id: ticket.id },
            include: ['user', 'status', 'postmark'],
        });

        expect(found).not.toBeNull();
        // @ts-ignore
        expect(found.user.email).toBe('jared@fortnite.com');
        // @ts-ignore
        expect(found.status.name).toBe('open');

        // @ts-ignore
        expect(found.postmark.town).toBe('Tilted Towers');
    });

    it('deletes ticket when postmark is deleted (CASCADE)', async () => {
        const user = await UserModel.create({ name: 'joe', email: 'joe@example.com' });
        const postmark = await PostmarkModel.create({
            postmark: 'DeleteMe',
            town: 'Nowhere',
            state: 'OH',
        });
        const status = await TicketStatusModel.create({
            id: 2,
            name: 'pending',
            user_id: user.id,
        });

        const ticket = await TicketModel.create({
            postmark_id: postmark.id,
            user_id: user.id,
            status_id: status.id,
            changes: {},
            comment: null,
            deny_comment: null,
        });

        await postmark.destroy();

        const join = await TicketModel.findByPk(ticket.id);
        expect(join).toBeNull();
    });
});
