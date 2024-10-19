import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ModelClass } from 'objection';
import { User } from 'src/core/user/entities/user.entity';
import { checkPassword, hashPassword } from 'src/common/helpers/password';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('User') private userModel: ModelClass<User>,
  ) {}

  async signUp(username: string, password: string) {
    /**
     * TODO:
     * check for existing username
     * Give initial balance of 500
     */
    const hashedPassword = hashPassword(password);
    const account = await this.userModel.query().insert({
      username: username,
      password: hashedPassword,
    });
    const token = this.jwtService.sign({
      id: account.id,
      username: account.username,
    });
    return {
      data: account,
      access_token: token,
    };
  }

  async signIn(username: string, password: string) {
    //TODO check valid username
    // graph fetch entries to make balance
    // graph fetch transactions
    //Cache balances
    let account = await this.userModel.query().findOne({ username });
    const isValid = checkPassword(password, account.password);

    if (!isValid) {
      throw Error('401');
    }
    const token = this.jwtService.sign({
      id: account.id,
      username: account.username,
    });
    return {
      data: account,
      access_token: token,
    };
  }
}
