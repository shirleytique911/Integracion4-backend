import mongoose from "mongoose"

const ticketsCollection = "ticket";

const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_datetime: Date,
    amount: Number,
    purchaser: String,
})
const ticketsModel = mongoose.model(ticketsCollection, ticketSchema)
// const ticketsModel = mongoose.model(`ticket`, ticketSchema)

export default ticketsModel