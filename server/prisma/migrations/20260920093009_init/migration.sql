-- CreateTable
CREATE TABLE "Click" (
    "id" SERIAL NOT NULL,
    "clickId" TEXT NOT NULL,
    "offer" TEXT NOT NULL,
    "sub1" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Click_clickId_key" ON "Click"("clickId");
