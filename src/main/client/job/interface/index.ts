import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class GenerateJobResultResponse {
  @Field({ nullable: true })
  resultUrl: string;
}
