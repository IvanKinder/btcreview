import { PrismaClient } from '@prisma/client'
import type { Price } from '../types/types'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    try {
        if (body.truncate) {
            await prisma.bitcoinPrice.deleteMany()
        }

        const dataCount = await prisma.bitcoinPrice.count()

        if (dataCount === 0) {
            const result = await prisma.bitcoinPrice.createMany({
                data: body.prices?.map((p: Price) => ({
                    price: p.price,
                    timestamp: new Date(p.timestamp)
                })),
                skipDuplicates: true
            })

            return { success: true, count: result.count }
        }
    } catch (e) {
        console.error(e)
        return { success: false, count: 0 }
    }

    return { success: true, count: 0 }
})