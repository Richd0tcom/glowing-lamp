import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelClass } from 'objection';
import { User } from './entities/user.entity';
import { Entry, Transfer } from '../transfers/entities/transfer.entity';
import { KnexInstance } from 'src/db';
import { isTrueModel } from 'src/common/helpers/object';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

export interface Balance {
  currentBalance: string;
  userId: string;
}

export interface BalanceWithUsername extends Balance {
  username: string
}

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('User') private User: ModelClass<User>,
  ) {}

  async getDetails(username: string) {
    const user = await User.query().findOne({ username });

    if (!isTrueModel(user)) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async getDetailsWithBalance(userId: string) {
    const user = await this.User.query().findById(userId);

    if (!isTrueModel(user)) {
      throw new NotFoundException('user not found');
    }

    const bal: BalanceWithUsername = await this.cacheManager.get(`bal-${userId}`)
    
    if(bal) {
      return bal
    }

    const result = await this.fetchBalance(userId)

    const balanceResult: BalanceWithUsername = {
      ...result,
      username: user.username,
    };

    //cache the value for subsequent fetch
    await this.cacheManager.set(`bal-${userId}`, balanceResult);

    return balanceResult;
  }

  async fetchBalance(userId: string, fromDb: boolean = true) {
    if(!fromDb) {
      const bal: Balance = await this.cacheManager.get(`bal-${userId}`)
      if(bal){
        return bal
      }
    }
    const results: Balance[] = await KnexInstance('entries')
      .select({
        userId: 'userId',
        currentBalance: KnexInstance.raw(
          `SUM(CASE WHEN "txType" = \'credit\' THEN CAST(amount AS DECIMAL(10,2)) WHEN "txType" = \'debit\' THEN -CAST(amount AS DECIMAL(10,2)) ELSE 0 END)`,
        ),
      })
      .where('userId', '=', userId)
      .groupBy('userId');

      return results[0]
  }

  async updateBalance(user: User) {
    const bal = await this.fetchBalance(user.id)
    const balance: BalanceWithUsername = {
      ...bal,
      username: user.username
    }

    await this.cacheManager.set(`bal-${user.id}`, balance);
  }
}
