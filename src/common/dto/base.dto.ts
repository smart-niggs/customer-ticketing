import { ApiHideProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

export abstract class BaseDto extends Document {
  readonly id: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly meta? : JSON
  @ApiHideProperty()
  readonly deleted_at?: Date;
}

