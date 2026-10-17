import { IsEmail, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Min(2)
  username!: string;

  @IsString()
  @IsNotEmpty()
  @Min(8)
  password!: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Min(2, { message: 'Username must be at least two characters' })
  @Max(10, { message: 'Username too long' })
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Min(8, { message: 'Password must be at least 8 characters' })
  @Max(20, { message: 'Password too long' })
  password!: string;
}
