import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class UserAuthGuard implements CanActivate{
    constructor(private readonly jwtService: JwtService){}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          throw new UnauthorizedException("Auth header topilmadi");
        }
        
        const token = authHeader.split(" ")[1];
        
        if (!token) {
          throw new UnauthorizedException("token topilmadi");
        }

        async function varify(token:string, jwtService:JwtService) {
            let decodToken: any;
            try {
                
              decodToken = jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_KEY,
              });
            } catch (error) {
              throw new UnauthorizedException({
                message: "Foydalanuvchi avtorizatsiyadan otmagan",
                error,
              });
            }
            req.user = decodToken
            return true
        }

        return varify(token, this.jwtService)
    }
}