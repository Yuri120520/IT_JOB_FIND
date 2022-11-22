import { QueryFilterDto } from '@enouvo-packages/base-nestjs-api';
import { SelectQueryBuilder } from 'typeorm';

import { AttachJobFilterCommand } from './attachJobFilter';

export class GenerateFilterResultWithPagination {
  static async execute(builder: SelectQueryBuilder<any>, queryParams: QueryFilterDto) {
    const { limit, page, orderBy } = queryParams;
    const offset = (page - 1) * limit;
    if (orderBy) {
      AttachJobFilterCommand.addOrderByQuery(builder, orderBy);
    }

    builder.skip(offset).take(limit);

    const [items, count] = await builder.getManyAndCount();

    const meta = {
      totalItems: count,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
    return { items, meta };
  }
}
