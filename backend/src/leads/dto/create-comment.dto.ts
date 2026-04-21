import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Текст коментаря',
    minLength: 1,
    maxLength: 500,
    example: 'Requested follow-up on Friday',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text!: string;
}
