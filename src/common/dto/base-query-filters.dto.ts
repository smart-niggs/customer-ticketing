import { IsNumber, IsOptional, Max, Min } from 'class-validator';

enum orderEnum {
  asc = 'asc',
  desc = 'desc'
}

export abstract class BaseQueryFiltersDto {

  // '?:' format is used intentionally so that Swagger recognizes the dtos properly
  page?: number = 1;

  @Min(1)
  @Max(200)
  limit?: number  = 20;

  order?: orderEnum = orderEnum.desc;

  sort_by?: string = 'created_at';

  search?: string;
}
