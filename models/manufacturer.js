/**
 * Created by Carlos on 11/4/15.
 */
/* Object/Relational mapping for instances of the Users class.
 - classes correspond to tables
 - instances correspond to rows
 - fields correspond to columns
 In other words, this code defines how a row in the postgres order table
 maps to the JS Order object.
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Manufacturer", {
            date: {type: DataTypes.DATE, allowNull: false},
            totalprice: {type: DataTypes.DECIMAL(10,2), allowNull: false}
        },
        {
            classMethods: {

            }
        });
};