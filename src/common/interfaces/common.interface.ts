import { Request } from 'express';

/**
 * Current authenticated user decoded from the auth payload
 */
export interface CurrentUser {
  id: string;
  username: string;
}

/**
 * interface extending [Express](https://expressjs.com/) request object
 */
export interface AuthRequest extends Request {
  user: CurrentUser;
}

/**
 * interface showing the users balance
 */
export interface Balance {
  currentBalance: string;
  userId: string;
}

/**
 * interface containg the users balance with their username
 */
export interface BalanceWithUsername extends Balance {
  username: string;
}
