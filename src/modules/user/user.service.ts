import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
const bcrypt = require('bcrypt');
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto as User } from './dto/user.dto';
import { ERROR_MESSAGES, ROLES_MODEL, USER_MODEL } from './constants';
import { pagingParser } from 'src/common/utils/paging-parser';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_MODEL) private readonly userModel: Model<User>,
    @Inject(ROLES_MODEL) private readonly roleModel: Model<User>
  ) { }

  async create(newUser: CreateUserDto): Promise<User> {

    if (await this.findOneByEmail(newUser.email))
      throw new BadRequestException(ERROR_MESSAGES.UserAlreadyExists);

    newUser.password = await bcrypt.hash(newUser.password, 10);
    newUser.role = await (await this.roleModel.findOne({ name: newUser.role_type })).id;

    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  async findAll(params): Promise<FindAllQueryInterface<User>> {
    const count = await this.userModel.countDocuments(params.where);
    const result = await this.userModel.find(params.where)
      .skip(params.skip)
      .limit(params.limit)
      .select('-password -__v -role')
      .sort(params.sort)
      .exec();

    const paging = pagingParser(params, count, result.length);

    return {
      paging,
      data: result
    };
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({
      email
    })
      .populate('role', 'scopes -_id')
      .exec();
  }

  async findOne(id: string): Promise<User> {
    // console.log('userModel.find({}): ' + JSON.stringify(await this.userModel.find({})));
    return this.userModel.findById(id)
      .select('-password -__v')
      .populate('role', 'scopes -_id')
      .exec();
  }
}
