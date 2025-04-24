import {Table,Column,DataType,HasMany,AllowNull, Model,ForeignKey,BelongsTo} from "sequelize-typescript";
import Expense from "./Expense";
import User from "./User";

@Table({
    tableName:'budgets'
})

class Budget extends Model{

    @AllowNull(false)
    @Column({
        type:DataType.STRING(100)
    })
    declare name:string

    @Column({
        type:DataType.DECIMAL
    })
    declare amount:number

    // one Budget has many expenses but one expense has only one budget
    @HasMany(() => Expense,{
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
    })
    declare expenses: Expense[]

    @ForeignKey(()=> User)
    declare userId:number

    @BelongsTo(()=> User)
    declare user:User

}

export default Budget
