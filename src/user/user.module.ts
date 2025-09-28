import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
	controllers: [UserController],
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), ConfigModule],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
