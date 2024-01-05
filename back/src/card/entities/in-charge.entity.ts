import {Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from 'typeorm'
import {Card} from './card.entity'
import {User} from '../../user/entities/user.entity'

@Entity({name: 'in_charge'})
export class InCharge {
    @PrimaryGeneratedColumn()
    inChargeSeq: number

    @ManyToOne(() => Card, card => card.inCharges, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'card_seq'})
    card: Card

    @Column('int')
    cardSeq: number

    @ManyToOne(() => User, user => user.inCharges, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_seq'})
    user: User
	
	@Column('int')
	userSeq: number
}
