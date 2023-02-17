import { CanActivate, ExecutionContext } from '@nestjs/common'

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        return request.session.userId;
    }
}

// import { CanActivate, ExecutionContext } from '@nestjs/common';
// export declare class AuthGuard implements CanActivate {
//     canActivate(context: ExecutionContext): any;
// }
