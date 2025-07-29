import { IsString } from 'class-validator';

class CreateNoteDto {
    @IsString()
    title!: string;

    @IsString()
    content!: string;
}

export default CreateNoteDto;