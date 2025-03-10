import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";
import { QueryFailedError } from "typeorm";

export class CustomException extends BadRequestException {
  constructor(error: any, message: string, handled: boolean) {
    super(
      handled ? null : error,
      handled
        ? message
        : "We apologize for the inconvenience. We are experiencing technical difficulties."
    );
  }
}

export class NoAccessException extends UnauthorizedException {
  constructor() {
    super(
      null,
      "It seems that you do not have enough privileges to perform this action."
    );
  }
}

@Catch(QueryFailedError)
export class QueryExceptionFilter implements GqlExceptionFilter {
  // @InjectRepository(EntitylogEntity)
  // private logRepo: Repository<EntitylogEntity>

  public catch(exception: any, host: ArgumentsHost) {
    console.log("QueryExceptionFilter . any", exception?.message);
    // this.logRepo = new Repository<EntitylogEntity>();

    // const gqlHost = GqlArgumentsHost.create(host);
    // console.log('QueryExceptionFilter . any', exception?.message);
    // console.log('QueryExceptionFilter . query :', exception?.query);
    // return exception;
    // this.logRepo = new Repository<EntitylogEntity>();
    // console.log('QueryExceptionFilter . this.logRepo', this.logRepo);
    // const log = this.logRepo.create();
    // log.name = "catch";
    // log.table = "product";
    // log.field = "query";
    // log.old_value = "old error";
    // log.new_value = "new error";

    // this.logRepo.save(log);

    return new Error(
      "We apologize for the inconvenience; we got malformed parameters."
    );
  }
}
