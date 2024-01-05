import { IsString } from "class-validator";
export class CreateBoardDto {
    @IsString()
    name : string

    @IsString()
    color : string;

    @IsString()
    description : string

}
