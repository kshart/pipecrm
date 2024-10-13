-- CreateTable
CREATE TABLE "Tag" (
    "title" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL,
    "count" INTEGER NOT NULL,
    "textColor" TEXT,
    "bgColor" TEXT,
    "cardOutlineColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("title")
);
