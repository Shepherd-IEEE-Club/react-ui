import { UserModel } from './user';
import { StateModel } from './state';
import { UserStateModel } from './user_state_junction.ts';

import '../test_sync.ts';

describe('user_state table', () => {
    it('creates user_state join entry', async () => {
        const user = await UserModel.create({ name: 'jared', email: 'jared@fortnite.com' });
        const state = await StateModel.create(
            { name: 'West Virginia', code: "wv" }
        );

        await UserStateModel.create({
            user_id: user.id,
            state_id: state.id,
        });

        const join = await UserStateModel.findOne({
            where: { user_id: user.id, state_id: state.id },
        });

        expect(join).toBeTruthy();
    });

    it('loads states via association', async () => {
        const user = await UserModel.create({ name: 'jared', email: 'jared@fortniteskbiti.com' });
        const state = await StateModel.create({ name: 'West Virginia', code: "wv" });

        await UserStateModel.create({
            user_id: user.id,
            state_id: state.id,
        });

        const result = await UserModel.findByPk(user.id, {
            include: { model: StateModel, as: 'states' },
        });

        expect(result).not.toBeNull();

        // @ts-ignore
        expect(result!.states).toBeInstanceOf(Array);
        // @ts-ignore
        expect(result!.states?.length).toBe(1);
        // @ts-ignore
        expect(result!.states![0].name).toBe('West Virginia');
    });

    it('removes join entry when user is deleted cascade', async () => {
        const user = await UserModel.create({ name: 'joe', email: 'joe@example.com' });
        const state = await StateModel.create({ name: 'Ohio', code: 'skbiibibyi' });

        await UserStateModel.create({
            user_id: user.id,
            state_id: state.id,
        });

        await user.destroy();

        const join = await UserStateModel.findOne({
            where: { user_id: user.id, state_id: state.id },
        });

        expect(join).toBeNull();
    });
});
