import { Brackets, SelectQueryBuilder } from 'typeorm';

import { JobFilterDto } from '../dto';

import { MAX_SALARY, MIN_SALARY } from '@/common/constant';
import { Job } from '@/db/entities/Job';

export class AttachJobFilterCommand {
  static async addFilterQuery(builder: SelectQueryBuilder<Job>, filters: JobFilterDto) {
    const { addresses, levelIds, salaryRanges, skillIds, title, types } = filters;

    if (title) {
      builder.andWhere(`unaccent(Job.description ->> 'title') ILIKE unaccent(:title)`, { title: `%${title}%` });
    }

    if (levelIds) {
      builder.andWhere('JobLevel.levelId IN (:...levelIds)', { levelIds });
    }
    if (skillIds) {
      builder.andWhere('JobSkill.skillId IN (:...skillIds)', { skillIds });
    }
    if (types) {
      builder.andWhere('Job.types && :types', { types });
    }
    if (addresses) {
      builder.andWhere(
        `unaccent(CompanyAddress.detail) ILIKE ANY (ARRAY[${addresses.map(item => `unaccent('%${item}%')`)}])`
      );
    }
    if (salaryRanges) {
      const ranges = salaryRanges.map(item => {
        const max = item.max ?? MAX_SALARY;
        const min = item.min ?? MIN_SALARY;
        return { max, min };
      });

      builder.andWhere(
        new Brackets(qb => {
          qb.where('FALSE');
          ranges.forEach(item => {
            qb.orWhere(
              `(SELECT numrange(( Job.salary ->> 'min') ::INTEGER , (Job.salary ->> 'max') ::INTEGER) && numrange('${item.min}','${item.max}'))`
            );
          });
        })
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
