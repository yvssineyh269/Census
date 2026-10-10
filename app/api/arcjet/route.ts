import arcjet, {
  detectBot,
  detectPromptInjection,
  sensitiveInfo,
  shield,
  tokenBucket,
} from "@arcjet/next";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

const aj = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: [] }),
    detectPromptInjection({ mode: "LIVE" }),
    sensitiveInfo({ mode: "LIVE", allow: [] }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export async function GET(req: Request) {
  const message = new URL(req.url).searchParams.get("message") ?? "";
  const decision = await aj.protect(req, {
    requested: 5,
    detectPromptInjectionMessage: message,
  });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          reason: decision.reason.toString(),
        },
        { status: 429 },
      );
    } else if (decision.reason.isPromptInjection()) {
      return NextResponse.json(
        {
          error: "Prompt injection detected",
          reason: decision.reason.toString(),
        },
        { status: 403 },
      );
    } else if (decision.reason.isSensitiveInfo()) {
      return NextResponse.json(
        {
          error: "Sensitive information detected",
          reason: decision.reason.toString(),
        },
        { status: 403 },
      );
    } else if (decision.reason.isBot()) {
      return NextResponse.json(
        {
          error: "Bot detected",
          reason: decision.reason.toString(),
        },
        { status: 403 },
      );
    } else {
      return NextResponse.json(
        {
          error: "Forbidden",
          reason: decision.reason.toString(),
        },
        { status: 403 },
      );
    }
  }

  if (decision.isAllowed()) {
    return NextResponse.json({ message: "Access granted" });
  } else {
    return NextResponse.json(
      {
        error: "Access denied",
        reason: decision.reason.toString(),
      },
      { status: 403 },
    );
  }
}
