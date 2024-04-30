const { createConnection } = require("../config/connection")
exports.queryRunner= async(query,data)=>{
    // console.log(2)
    console.log(query,data)
    // console.log(query,data)
    const connection = await createConnection();
    // console.log(await connection.execute(query,data))
    return await connection.execute(query,data)
}