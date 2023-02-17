import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of the users service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 999999), email, password} as User
                users.push(user);
                return Promise.resolve(user);
            }
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                },
            ],
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a user with salted and hashed password', async () => {
        const user = await service.signup('ded@gmail.com', 'ksdsk');

        expect(user.password).not.toEqual('ksdsk');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if users signs up with email that is in use', async () => {
        await service.signup('ded@gmail.com', 'ksdsk');
        await expect(service.signup('ded@gmail.com', 
        'ksdsk')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('throws if sigin is called with an unused email', async () => {
        await expect(
            service.signin('gsaga@gmail.com', 'gsfasghas'),
        ).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
       await service.signup('laskdjf@alskdfj.com', 'password');
       await expect(
        service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
       ).rejects.toThrow(BadRequestException);
    });

    it('retruns a user if correct password is provided', async() => {
        await service.signup('Calus@gmail.com', '3456789');

        const user = await service.signin('Calus@gmail.com', '3456789');
        expect(user).toBeDefined();
    });
});
