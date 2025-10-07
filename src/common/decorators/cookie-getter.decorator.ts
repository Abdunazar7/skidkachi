import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common";

export const CookieGetter = createParamDecorator(
  (key: string, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies[key];

    if (!refreshToken) {
      throw new BadRequestException("Token is not found.");
    }

    return refreshToken;
  }
);
