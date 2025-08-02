import { verifyPassword } from './password';

describe('verifyPassword', () => {
    it('should return false if password is blank and hash is null', () => {
        const blankPassword = '';
        const nullHash = null as unknown as string;

        const result = verifyPassword(blankPassword, nullHash);

        expect(result).toBe(false);
    });

    it('should return false if password is whitespace and hash is null', () => {
        const result = verifyPassword('   ', null as any);
        expect(result).toBe(false);
    });

    it('should return false if either is undefined', () => {
        expect(verifyPassword(undefined as any, 'hash')).toBe(false);
        expect(verifyPassword('password', undefined as any)).toBe(false);
    });
});
