import { Global, Module } from '@nestjs/common';
import { Account } from 'src/core/account/entities/account.entity';


const models = [Account];
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
