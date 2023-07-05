import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;
 
  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  updated_at: Date;

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Deleted user with email: ', this.email);
  }
}
