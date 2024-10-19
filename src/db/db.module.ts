import { Global, Module } from '@nestjs/common';
import { User } from 'src/core/user/entities/user.entity';


const models = [User];
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
