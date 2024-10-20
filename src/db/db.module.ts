import { Global, Module } from '@nestjs/common';
import { Entry, Transfer } from 'src/core/transfers/entities/transfer.entity';
import { User } from 'src/core/user/entities/user.entity';


const models = [User, Entry, Transfer];
const providers = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DbModule {}
