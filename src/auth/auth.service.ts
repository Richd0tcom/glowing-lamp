import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ModelClass } from 'objection';
import { User } from 'src/core/user/entities/user.entity';
import { checkPassword, hashPassword } from 'src/common/helpers/password';
import { JwtService } from '@nestjs/jwt';
import { isTrueModel } from 'src/common/helpers/object';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('User') private userModel: ModelClass<User>,
  ) {}

  async signUp(createAuthDto: CreateAuthDto) {
    /**
     * TODO:
     * check for existing username
     * Give initial balance of 500
     */
    let existingAccount = await this.userModel.query().findOne({ username: createAuthDto.username });

    if(isTrueModel(existingAccount)){
      throw new BadRequestException('username aleady taken')
    }

    const hashedPassword = hashPassword(createAuthDto.password);
    const account = await this.userModel.query().insert({
      username: createAuthDto.username,
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

  async signIn(createAuthDto: CreateAuthDto) {
    //TODO check valid username
    // graph fetch entries to make balance
    // graph fetch transactions
    //Cache balances
    let account = await this.userModel.query().findOne({ username: createAuthDto.username });
    if(!isTrueModel(account)){
      throw new UnauthorizedException('username or password incorrect');
    }
    const isValid = checkPassword(createAuthDto.password, account.password);

    if (!isValid) {
      throw new UnauthorizedException('username or password incorrect');
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
