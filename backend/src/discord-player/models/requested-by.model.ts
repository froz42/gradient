import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RequestedBy {
  @Field(() => String)
  id: string;

  @Field(() => String)
  displayName: string;

  @Field(() => String)
  avatar: string;
}
