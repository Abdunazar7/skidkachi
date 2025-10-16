import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";


export const CookieGetter = createParamDecorator(
    async (key:string, context: ExecutionContext):Promise<string> => {
        const request = context.switchToHttp().getRequest()

        const refreshToken = request.cookie[key]

        if(!refreshToken){
            throw new BadRequestException("Token is not found")
        }
        return refreshToken
    }
)