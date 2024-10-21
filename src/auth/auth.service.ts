import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ModelClass } from 'objection';
import { User } from 'src/core/user/entities/user.entity';
import { checkPassword, hashPassword } from 'src/common/helpers/password';
import { JwtService } from '@nestjs/jwt';
import { isTrueModel } from 'src/common/helpers/object';
import { AuthResponse } from 'src/common/interfaces/common.interface';
import { Entry } from 'src/core/transfers/entities/entry.entity';
import { TxType } from 'src/common/enums/common.enums';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('User') private userModel: ModelClass<User>,
    @Inject('Entry') private Entry: ModelClass<Entry>,
  ) {}

  /**
   * Registers a new user
   * 
   * @param createAuthDto 
   * @returns 
   */
  async signUp(createAuthDto: CreateAuthDto): Promise<AuthResponse> {
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

    /**
     * Every user gets an amount of 30 on signup (for testing purposes)
     */
    await this.Entry.query().insert({
      userId: account.id,
      txType: TxType.CREDIT,
      amount: 30
    })

    return {
      user: account,
      access_token: token,
    };
  }

  async signIn(createAuthDto: CreateAuthDto): Promise<AuthResponse> {

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
      user: account,
      access_token: token,
    };
  }
}
