import "dotenv/config";
import express from "express";
import { randomUUID } from "node:crypto";
import { prisma } from "./config/db/prisma";

const app = express();
const port = Number(process.env.PORT) || 3000;

const offerUrls: Record<string, string> = {
  Dell: "https://www.dell.com/en-us",
};

app.set("trust proxy", true);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/clicks", async (_request, response) => {
  try {
    const clicks = await prisma.click.findMany({
      select: {
        clickId: true,
        offer: true,
        sub1: true,
        timestamp: true,
        ip: true,
        userAgent: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    response.json(clicks);
  } catch (error) {
    console.error("Failed to fetch clicks:", error);

    response.status(500).json({
      error: "Failed to fetch clicks",
    });
  }
});

app.get("/click", async (request, response) => {
  const { offer, sub1 } = request.query;

  if (typeof offer !== "string" || !offerUrls[offer]) {
    response.status(400).json({
      error: "Invalid or unsupported offer",
    });
    return;
  }

  if (sub1 !== undefined && typeof sub1 !== "string") {
    response.status(400).json({
      error: "Invalid sub1",
    });
    return;
  }

  const clickId = randomUUID();

  try {
    await prisma.click.create({
      data: {
        clickId,
        offer,
        sub1: sub1 ?? null,
        timestamp: new Date(),
        ip: request.ip ?? null,
        userAgent: request.get("user-agent") ?? null,
      },
    });

    response.redirect(302, offerUrls[offer]);
  } catch (error) {
    console.error("Failed to save click:", error);

    response.status(500).json({
      error: "Failed to process click",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
