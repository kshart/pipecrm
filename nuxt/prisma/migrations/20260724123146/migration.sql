-- CreateTable
CREATE TABLE "CardMessage" (
    "id" BIGSERIAL NOT NULL,
    "message" JSONB NOT NULL,
    "reactions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "cardUuid" UUID NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "CardMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CardMessage" ADD CONSTRAINT "CardMessage_cardUuid_fkey" FOREIGN KEY ("cardUuid") REFERENCES "Card"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardMessage" ADD CONSTRAINT "CardMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
