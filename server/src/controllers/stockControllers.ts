import { prisma } from "../exports/prisma";
import type { Request, Response } from "express";

async function getCurrentStock(req: Request, res: Response): Promise<void> {
  try {
    // get product name and quantity from current stock
    const currentStock = await prisma.currentStock.findMany({
      where: { userId: req.user?.id },
      select: {
        productId: true,
        quantity: true,
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!currentStock) {
      res.status(404).json({
        success: false,
        error: "No stock items found",
      });
      return;
    }

    res.json({
      success: true,
      data: currentStock,
    });
    return;

  } catch (error) {
    console.error("Error fetching current stock:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching current stock",
    });
    return;
  }
}

async function updateCurrentStock(req: Request, res: Response): Promise<void> {

    try {
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            res.status(400).json({
                success: false,
                error: "Product ID and quantity are required",
            });
            return;
        }
        const updatedStock = await prisma.currentStock.upsert({
            where: { productId, userId: req.user?.id },
            update: { quantity },
            create: {
                productId,
                quantity,
                userId: req.user?.id, 
            },
        });

        res.json({
            success: true,
            data: updatedStock,
        });
        return;

    } catch (error) {
        console.error("Error updating current stock:", error);
        res.status(500).json({
            success: false,
            error: "An error occurred while updating current stock",
        });
        return;
    }
}

export { getCurrentStock, updateCurrentStock };