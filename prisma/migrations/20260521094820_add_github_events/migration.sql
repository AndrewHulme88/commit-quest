-- CreateTable
CREATE TABLE "GIthubEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "xpAwarded" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GIthubEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GIthubEvent" ADD CONSTRAINT "GIthubEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
