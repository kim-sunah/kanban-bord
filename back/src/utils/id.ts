import {IsInt, Min, ValidateIf} from 'class-validator'
import {Type} from 'class-transformer'

export class Id {
    @IsInt()
    @Type(() => Number)
    @Min(1)
    id: number
	
	@ValidateIf((o,v) => v != undefined)
	@IsInt()
    @Type(() => Number)
    @Min(1)
    columnSeq: number | undefined
	
	@ValidateIf((o,v) => v != undefined)
	@IsInt()
    @Type(() => Number)
    @Min(1)
    userSeq: number | undefined
}