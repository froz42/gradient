import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Image {
  @Field(() => String, { nullable: true })
  url?: string | null;
  @Field(() => Number)
  width: number;
  @Field(() => Number)
  height: number;
}
