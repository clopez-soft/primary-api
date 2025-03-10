import { Resolver, Query, } from '@nestjs/graphql';

import { AppService } from './app.service';

@Resolver(() => String)
export class AppResolver {

  constructor
    (private readonly appService: AppService) { }

  @Query(() => String, { name: 'apps', nullable: true })
  findAll() {
    return this.appService.findAll();
  }

}
