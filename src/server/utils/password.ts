import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';


export function createPasswordHash(plain: string): string {
    const salt = genSaltSync(10);
    return hashSync(plain, salt);
}

export function verifyPassword(plain: string, hashed: string): boolean {
    if (!hashed) return false;
    if (!plain) return false;
    return compareSync(plain, hashed);
}
