import { SelectQueryBuilder } from 'typeorm';

import { CompanyFilterDto } from '../dto';

import { Company } from '@/db/entities/Company';
import { Job } from '@/db/entities/Job';

export class AttachCompanyFilterCommand {
  static async addFilterQuery(builder: SelectQueryBuilder<Company>, filters: CompanyFilterDto) {
    const { addresses, name, skillIds } = filters;

    if (name) {
      builder.andWhere(`unaccent(Company.name) ILIKE unaccent(:name)`, { name: `%${name}%` });
    }

    if (skillIds) {
      builder.andWhere('CompanySkill.skillId IN (:...skillIds)', { skillIds });
    }

    if (addresses) {
      builder.andWhere(
        `unaccent(CompanyAddress.detail) ILIKE ANY (ARRAY[${addresses.map(item => `unaccent('%${item}%')`)}])`
      );
    }

    return builder;
  }

  static async addOrderByQuery(builder: SelectQueryBuilder<Job>, orderBy: string) {
    const field = orderBy.split(':')[0];
    const sortBy = orderBy.split(':')[1].toUpperCase() as 'DESC' | 'ASC';
    const nulls = String(orderBy.split(':')[2]).replace('_', ' ').toUpperCase() as 'NULLS FIRST' | 'NULLS LAST';
    if (['ASC', 'DESC'].includes(sortBy)) {
      if (['NULLS FIRST', 'NULLS LAST'].includes(nulls)) {
        builder.orderBy(`${field}`, sortBy, nulls);
        return builder;
      }
      builder.orderBy(`${field}`, sortBy);
    }

    return builder;
  }
}
