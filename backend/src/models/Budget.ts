import {Table,Column,DataType,HasMany, Model} from "sequelize-typescript";
import Expense from "./Expense";

@Table({
    tableName:'budgets'
})

class Budget extends Model{
    @Column({
        type:DataType.STRING(100)
    })
    declare name:string

    @Column({
        type:DataType.DECIMAL
    })
    declare amount:number

    // Budget has many expenses but one expense has only budget
    @HasMany(() => Expense,{
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
    })
    declare expenses: Expense[]
}

export default Budget
