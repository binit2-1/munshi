import { prisma } from "../src/exports/prisma";
import type { PaymentMethod } from "../src/generated/prisma/enums";
import bcrypt from "bcrypt";

async function main() {
  console.log("🧹 Clearing old data...");
  // Delete in correct order due to foreign keys
  await prisma.message.deleteMany();
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.currentStock.deleteMany();
  await prisma.productDetails.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  console.log("👤 Creating test user...");
  const hashedPassword = await bcrypt.hash("testuser123", 10);
  
  const testUser = await prisma.user.create({
    data: {
      id: "test-user-001",
      name: "Test User",
      email: "testuser@example.com",
      emailVerified: true,
      accounts: {
        create: {
          id: "test-account-001",
          accountId: "testuser",
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  });

  console.log(`✅ Test user created: ${testUser.email}`);

  const productCatalog = [
    { name: 'Amul Butter 500g', pPrice: 240, sPrice: 275 },
    { name: 'Aashirvaad Atta 5kg', pPrice: 210, sPrice: 245 },
    { name: 'Tata Tea Gold 250g', pPrice: 135, sPrice: 160 },
    { name: 'Maggi Noodles 12-Pack', pPrice: 155, sPrice: 180 },
    { name: 'Parle-G 800g Pack', pPrice: 70, sPrice: 85 },
    { name: 'Surf Excel Matic 1kg', pPrice: 210, sPrice: 240 },
    { name: 'Britannia Marie Gold', pPrice: 25, sPrice: 35 },
    { name: 'Haldiram Bhujia 400g', pPrice: 80, sPrice: 105 },
    { name: 'Thums Up 2L', pPrice: 75, sPrice: 95 },
    { name: 'Dettol Handwash Refill', pPrice: 85, sPrice: 99 },
    { name: 'Fortune Sunflower Oil 1L', pPrice: 140, sPrice: 165 },
    { name: 'Lays Magic Masala', pPrice: 15, sPrice: 20 },
    { name: 'Nescafe Classic 100g', pPrice: 290, sPrice: 320 },
    { name: 'Catch Sprinklers Salt', pPrice: 18, sPrice: 25 },
    { name: 'Vim Dishwash Bar', pPrice: 8, sPrice: 10 },
  ];

  console.log(`📦 Creating ${productCatalog.length} products...`);
  const products = [];
  for (const item of productCatalog) {
    const p = await prisma.productDetails.create({
      data: {
        name: item.name,
        purchasePrice: item.pPrice,
        sellingPrice: item.sPrice,
        expiryDate: new Date('2026-12-31'),
        userId: testUser.id,
      }
    });
    
    // Create currentStock separately after product is created
    await prisma.currentStock.create({
      data: {
        quantity: Math.floor(Math.random() * 100) + 50, // Random stock 50-150
        userId: testUser.id,
        productId: p.id,
      }
    });
    
    products.push(p);
  }

  // 2. RANDOMIZED SALES SIMULATION
  console.log("🛒 Simulating 30 random transactions...");
  const methods: PaymentMethod[] = ['CASH', 'UPI', 'CREDIT'];

  for (let i = 0; i < 30; i++) {
    // Pick 1 to 4 random unique products for this "basket"
    const basketSize = Math.floor(Math.random() * 4) + 1;
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffled.slice(0, basketSize);

    let transactionTotal = 0;
    const itemData: { productId: string; quantity: number; userId: string }[] = [];

    for (const prod of selectedProducts) {
      const qty = Math.floor(Math.random() * 3) + 1; // 1-3 of each item
      transactionTotal += prod.sellingPrice * qty;
      itemData.push({ productId: prod.id, quantity: qty, userId: testUser.id });
    }

    const method = methods[Math.floor(Math.random() * methods.length)] as PaymentMethod;

    await prisma.$transaction(async (tx) => {
      // Create the Transaction
      await tx.transaction.create({
        data: {
          totalAmount: transactionTotal,
          paymentMethod: method,
          userId: testUser.id,
          items: { create: itemData }
        }
      });

      // Update Stock for each item in the basket
      for (const item of itemData) {
        await tx.currentStock.update({
          where: { productId: item.productId },
          data: { quantity: { decrement: item.quantity } }
        });
      }
    });
  }

  console.log("✅ Seed finished! Supermarket is now busy.");
  console.log("\n📝 Test User Credentials:");
  console.log(`   Email: testuser@example.com`);
  console.log(`   Password: testuser123`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());