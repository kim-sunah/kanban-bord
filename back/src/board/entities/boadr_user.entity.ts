import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({
    name : "Board_user"
})
export class Boarduser {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    borderId  : number;

    @Column()
    userId : number


}