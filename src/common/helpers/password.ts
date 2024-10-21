import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

/**
 * Password hashing helper function
 * @param password 
 * @param salt 
 * @returns {string}
 */
export const hashPassword = (password: string, salt: number =saltOrRounds): string => {
    return bcrypt.hashSync(password, salt);
}

/**
 * Password validation helper function
 * @param password 
 * @param hashedPassword
 * @returns {boolean}
 */
export const checkPassword = (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
}