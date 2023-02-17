import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor{
    constructor(private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((data: any) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                });
            }),
        )
    }
}

// import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
// import { Observable } from 'rxjs';
// interface ClassConstructor {
//     new (...args: any[]): {};
// }
// export declare function Serialize(dto: ClassConstructor): MethodDecorator & ClassDecorator;
// export declare class SerializeInterceptor implements NestInterceptor {
//     private dto;
//     constructor(dto: any);
//     intercept(context: ExecutionContext, handler: CallHandler): Observable<any>;
// }
// export {};

