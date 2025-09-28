import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { User, UserDocument, UserRole } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { genSalt, hash } from 'bcryptjs';
import { USER_ALREADY_EXISTS, USER_NOT_FOUND } from './user-constants';

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

	async create(dto: CreateUserDto): Promise<UserDocument> {
		const existingUser = await this.findByEmail(dto.email);
		if (existingUser) {
			throw new BadRequestException(USER_ALREADY_EXISTS);
		}
		const salt = await genSalt(10);
		const passwordHash = await hash(dto.password, salt);
		const user = new this.userModel({
			email: dto.email,
			passwordHash,
			phone: dto.phone,
			name: dto.name,
		});
		return user.save();
	}
	async findByEmail(email: string): Promise<UserDocument | null> {
		const user = await this.userModel.findOne({ email });
		return user;
	}

	async findById(_id: string): Promise<UserDocument | null> {
		const user = await this.userModel.findById(_id);
		if (!user) {
			throw new HttpException(USER_NOT_FOUND, 404);
		}
		return user;
	}

	async updateRole(_id: string, role: UserRole): Promise<UserDocument> {
		const user = await this.userModel.findByIdAndUpdate(_id, { role }, { new: true });
		if (!user) {
			throw new HttpException(USER_NOT_FOUND, 404);
		}
		return user;
	}

	async update(_id: string, dto: UpdateUserDto): Promise<UserDocument | null> {
		const user = await this.userModel.findByIdAndUpdate(_id, { $set: dto }, { new: true });
		if (!user) {
			throw new HttpException(USER_NOT_FOUND, 404);
		}
		return user;
	}
	async delete(_id: string): Promise<UserDocument | null> {
		const user = await this.userModel.findByIdAndDelete(_id);
		if (!user) {
			throw new HttpException(USER_NOT_FOUND, 404);
		}
		return user;
	}

	async findAll(): Promise<UserDocument[]> {
		const users = await this.userModel.find();
		return users;
	}
}
