import { Global, Module } from '@nestjs/common';
import { Entry } from 'src/core/transfers/entities/entry.entity';
import { Reference, Transfer } from 'src/core/transfers/entities/transfer.entity';
import { User } from 'src/core/user/entities/user.entity';


const models = [User, Entry, Transfer, Reference];
const providers = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

/**
 * Database module for providing queries
 */
@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DbModule {}
