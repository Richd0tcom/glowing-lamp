import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ModelClass } from 'objection';
import { Account } from 'src/core/account/entities/account.entity';
import { checkPassword, hashPassword } from 'src/common/helpers/password';

@Injectable()
export class AuthService {

  constructor(
    @Inject('Account') private accountModel: ModelClass<Account>,
  ) {
    
  }

  
  async signUp(username: string, password: string) {
    /**
     * TODO: 
     * check for existing username
     * Give initial balance of 500
     */
    const hashedPassword = hashPassword(password)
    const account = await this.accountModel.query().insert({
      username: username,
      password: hashedPassword
    })
    return account
  }

  async signIn(username: string, password: string) {
    //TODO check valid username
    // graph fetch entries to make balance
    // graph fetch transactions
    //Cache balances
    let account = await this.accountModel.query().findOne({username})
    const isValid = checkPassword(password, account.password)

    if(!isValid) {
      throw Error('401')
    }
     return account
  }
}
