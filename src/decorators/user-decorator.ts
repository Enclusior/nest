import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestWithUser } from '../user/user.model';
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<IRequestWithUser>();
	return request.user;
});
