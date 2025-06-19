import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const { interval, start, end } = getQuery(event)

    if (interval && !['day', 'week', 'month', 'year'].includes(interval as string)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid interval. Use: day, week, month, year'
        })
    }

    const dateRange = getDateRange(interval as string, start as string, end as string)

    try {
        const prices = await prisma.bitcoinPrice.findMany({
            where: {
                timestamp: {
                    gte: dateRange.startDate,
                    lte: dateRange.endDate
                }
            },
            orderBy: {
                timestamp: 'asc'
            },
            select: {
                timestamp: true,
                price: true
            }
        })

        return {
            status: 'success',
            prices
        }
    } catch (error) {
        console.error('Database error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch prices'
        })
    } finally {
        await prisma.$disconnect()
    }
})

function getDateRange(interval?: string, start?: string, end?: string) {
    if (start && end) {
        return {
            startDate: new Date(start),
            endDate: new Date(end)
        }
    }

    const endDate = new Date()
    const startDate = new Date()

    switch (interval) {
        case 'day':
            startDate.setDate(endDate.getDate() - 1)
            break
        case 'week':
            startDate.setDate(endDate.getDate() - 7)
            break
        case 'month':
            startDate.setMonth(endDate.getMonth() - 1)
            break
        case 'year':
            startDate.setFullYear(endDate.getFullYear() - 1)
            break
        default:
            startDate.setDate(endDate.getDate() - 7)
    }

    return { startDate, endDate }
}