import { prisma } from "../exports/prisma";
import type { Request, Response } from "express";

type item = {
    productId: string;
    quantity: number;
}

export async function newTransaction(req: Request, res: Response): Promise<void> {
    try {
        const { items, totalAmount, paymentMethod } = req.body;

        if (!items || !totalAmount || !paymentMethod) {
            res.status(400).json({
                success: false,
                error: "Items, total amount, and payment method are required",
            });
            return;
        }

        // Atomic transaction to ensure data integrity
        const transaction = await prisma.$transaction(async (prisma) => {
            const newTransaction = await prisma.transaction.create({
                data: {
                    totalAmount,
                    paymentMethod,
                    userId: req.user?.id,
                },
            });

            const transactionItemsData = items.map((item: item) => ({
                productId: item.productId,
                quantity: item.quantity,
                transactionId: newTransaction.id,
            }));

            await prisma.transactionItem.createMany({
                data: transactionItemsData,
            });

            // Update current stock for each product
            for (const item of items) {
                await prisma.currentStock.update({
                    where: { productId: item.productId, userId: req.user?.id },
                    data: {
                        quantity: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return newTransaction;
        });

        res.json({
            success: true,
            data: transaction,
        });
        return;

    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({
            success: false,
            error: "An error occurred while creating the transaction",
        });
        return;
    }
}
