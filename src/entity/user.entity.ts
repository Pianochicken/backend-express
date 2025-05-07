import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Base } from './base.entity'

@Entity()
export class User extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 50, nullable: false })
    name: string

    @Column({ type: "varchar", length: 100, nullable: false })
    email: string

    @Column({ type: "varchar", length: 100, nullable: false })
    password: string
}