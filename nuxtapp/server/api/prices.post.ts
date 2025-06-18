import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const newEntry = await prisma.bitcoinPrice.create({
        data: {
            price: body.price,
            timestamp: new Date()
        }
    })

    return { success: true, data: newEntry }
})