import { ApiHideProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

export abstract class BaseCreateDto extends Document {
  @ApiHideProperty()
  readonly created_by?: string;
}

