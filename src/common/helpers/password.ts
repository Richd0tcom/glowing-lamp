import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export const hashPassword = (password: string, salt: number =saltOrRounds) => {
    return bcrypt.hashSync(password, salt);
}

export const checkPassword = (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword)
}