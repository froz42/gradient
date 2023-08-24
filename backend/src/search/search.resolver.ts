import { Args, Query, Resolver } from '@nestjs/graphql';
import { Search } from './model/search.model';
import { SearchService } from './search.service';

@Resolver(() => Search)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => Search)
  search(@Args('query') query: string) {
    return this.searchService.search(query);
  }
}
