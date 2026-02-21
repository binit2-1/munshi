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
    { name: "Aashirvaad Atta 10kg", pPrice: 420, sPrice: 495 },
    { name: "Aashirvaad Atta 5kg", pPrice: 215, sPrice: 250 },
    { name: "Fortune Sunflower Oil 1L", pPrice: 135, sPrice: 165 },
    { name: "Fortune Sunflower Oil 5L", pPrice: 675, sPrice: 825 },
    { name: "Saffola Gold Oil 1L", pPrice: 160, sPrice: 195 },
    { name: "Basmati Rice 5kg", pPrice: 360, sPrice: 430 },
    { name: "Kolam Rice 10kg", pPrice: 520, sPrice: 620 },
    { name: "Toor Dal 1kg", pPrice: 125, sPrice: 150 },
    { name: "Moong Dal 1kg", pPrice: 120, sPrice: 145 },
    { name: "Chana Dal 1kg", pPrice: 105, sPrice: 130 },
    { name: "Rajma 1kg", pPrice: 135, sPrice: 165 },
    { name: "Kabuli Chana 1kg", pPrice: 110, sPrice: 140 },
    { name: "Tata Salt 1kg", pPrice: 20, sPrice: 26 },
    { name: "Catch Sprinklers Salt", pPrice: 18, sPrice: 25 },
    { name: "Sugar 1kg", pPrice: 42, sPrice: 50 },
    { name: "Tea Leaf 250g", pPrice: 120, sPrice: 150 },
    { name: "Tata Tea Gold 500g", pPrice: 260, sPrice: 310 },
    { name: "Bru Instant 100g", pPrice: 180, sPrice: 220 },
    { name: "Nescafe Classic 100g", pPrice: 290, sPrice: 330 },
    { name: "Maggi Noodles 12-Pack", pPrice: 155, sPrice: 185 },
    { name: "Yippee Noodles 8-Pack", pPrice: 130, sPrice: 155 },
    { name: "Kissan Ketchup 500g", pPrice: 90, sPrice: 110 },
    { name: "Ching's Schezwan Chutney 250g", pPrice: 70, sPrice: 90 },
    { name: "Haldiram Bhujia 400g", pPrice: 80, sPrice: 105 },
    { name: "Lays Magic Masala", pPrice: 15, sPrice: 20 },
    { name: "Bingo Mad Angles", pPrice: 18, sPrice: 25 },
    { name: "Parle-G 800g Pack", pPrice: 70, sPrice: 85 },
    { name: "Britannia Marie Gold", pPrice: 25, sPrice: 35 },
    { name: "Britannia Good Day 600g", pPrice: 90, sPrice: 110 },
    { name: "Amul Butter 500g", pPrice: 240, sPrice: 275 },
    { name: "Amul Milk 1L", pPrice: 56, sPrice: 62 },
    { name: "Mother Dairy Curd 500g", pPrice: 40, sPrice: 48 },
    { name: "Amul Cheese 200g", pPrice: 105, sPrice: 125 },
    { name: "Dairy Milk 45g", pPrice: 40, sPrice: 50 },
    { name: "Thums Up 2L", pPrice: 75, sPrice: 95 },
    { name: "Coca-Cola 2L", pPrice: 75, sPrice: 95 },
    { name: "Bottled Water 1L", pPrice: 15, sPrice: 20 },
    { name: "Dettol Handwash Refill 750ml", pPrice: 85, sPrice: 99 },
    { name: "Savlon Handwash 750ml", pPrice: 90, sPrice: 110 },
    { name: "Surf Excel Matic 1kg", pPrice: 210, sPrice: 245 },
    { name: "Ariel Matic 1kg", pPrice: 215, sPrice: 250 },
    { name: "Wheel Detergent 1kg", pPrice: 65, sPrice: 80 },
    { name: "Vim Dishwash Bar", pPrice: 8, sPrice: 10 },
    { name: "Vim Liquid 250ml", pPrice: 55, sPrice: 70 },
    { name: "Colgate Toothpaste 200g", pPrice: 85, sPrice: 105 },
    { name: "Dabur Red Paste 200g", pPrice: 90, sPrice: 110 },
    { name: "Clinic Plus Shampoo 650ml", pPrice: 180, sPrice: 220 },
    { name: "Head & Shoulders 340ml", pPrice: 210, sPrice: 255 },
    { name: "Lifebuoy Soap 4-Pack", pPrice: 110, sPrice: 140 },
    { name: "Lux Soap 4-Pack", pPrice: 120, sPrice: 145 },
    { name: "Good Knight Refill", pPrice: 75, sPrice: 95 },
    { name: "All Out Refill", pPrice: 70, sPrice: 90 }
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
        quantity: Math.floor(Math.random() * 300) + 120,
        userId: testUser.id,
        productId: p.id,
      }
    });
    
    products.push(p);
  }

  // 2. RANDOMIZED SALES SIMULATION (LAST 12 MONTHS)
  console.log("🛒 Simulating realistic transactions for the last 12 months...");

  const now = new Date();
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - 12);

  const daysBetween = (a: Date, b: Date) =>
    Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));

  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  const randomTimeOnDate = (date: Date) => {
    const d = new Date(date);
    const hour = randomInt(9, 21);
    const minute = randomInt(0, 59);
    const second = randomInt(0, 59);
    d.setHours(hour, minute, second, 0);
    return d;
  };

  const pickWeightedMethod = () => {
    const r = Math.random();
    if (r < 0.55) return "UPI" as PaymentMethod;
    if (r < 0.85) return "CASH" as PaymentMethod;
    return "CREDIT" as PaymentMethod;
  };

  const weeksCount = Math.max(1, Math.floor(daysBetween(startDate, now) / 7));

  for (let w = 0; w <= weeksCount; w++) {
    const weekStart = addDays(startDate, w * 7);
    const txCount = randomInt(8, 22);

    for (let t = 0; t < txCount; t++) {
      const dayOffset = randomInt(0, 6);
      const txDate = randomTimeOnDate(addDays(weekStart, dayOffset));

      // Pick 1 to 5 random unique products for this "basket"
      const basketSize = randomInt(1, 5);
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const selectedProducts = shuffled.slice(0, basketSize);

      let transactionTotal = 0;
      const itemData: { productId: string; quantity: number; userId: string }[] = [];

      for (const prod of selectedProducts) {
        const qty = randomInt(1, 4);
        transactionTotal += prod.sellingPrice * qty;
        itemData.push({ productId: prod.id, quantity: qty, userId: testUser.id });
      }

      const method = pickWeightedMethod();

      await prisma.$transaction(async (tx) => {
        // Create the Transaction
        await tx.transaction.create({
          data: {
            totalAmount: Number(transactionTotal.toFixed(2)),
            paymentMethod: method,
            userId: testUser.id,
            createdAt: txDate,
            items: {
              create: itemData.map((item) => ({
                ...item,
                createdAt: txDate,
              }))
            }
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