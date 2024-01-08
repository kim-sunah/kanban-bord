import {} from "class-validator"
import {Entity, Column, PrimaryGeneratedColumn , CreateDateColumn, UpdateDateColumn} from "typeorm"

@Entity({
    name : "board"
})
export class Board {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    name : string

    @Column()
    color : string

    @Column()
    description : string

    @CreateDateColumn()
    created_at : Date

    @UpdateDateColumn()
    updated_at : Date

    @Column()
    userId : number;

}
