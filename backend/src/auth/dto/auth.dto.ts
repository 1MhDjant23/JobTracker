import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Username must be at least two characters' })
  @MaxLength(10, { message: 'Username too long' })
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(20, { message: 'Password too long' })
  password!: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Username must be at least two characters' })
  @MaxLength(10, { message: 'Username too long' })
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(20, { message: 'Password too long' })
  password!: string;
}
// {
//   "data": {
//     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTQ3ODk4ZS0yMTBmLTQzZmItOGI0OS00NTgwNTI3ZDkwNDAiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzkzMzkyMTU2LCJleHAiOjE3OTMzOTI1NzZ9.OsaG6Svnp5L7ARk40fVXsOr0AseD2KJrLmD-aYSLPAE",
//     "user": {
//       "id": "2947898e-210f-43fb-8b49-4580527d9040",
//       "email": "mait@gmail.com",
//       "username": "simo"
//     }
//   }
