import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';

@Module({
  imports: [],
  providers: [ AppResolver, AppService ],
  exports: [ AppService ]
})
export class MtAppModule { }
