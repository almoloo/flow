import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get("amount");
  const to = searchParams.get("to");

  if (!amount || !to) {
    return new Response(JSON.stringify({ error: "Missing required query parameters" }), { status: 400 });
  }

  try {
    // FETCH SWAP RATE FROM coinmarketcap API
    const res = await fetch(
      `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=${amount}&symbol=USDT&convert=${to}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY || "",
        },
      },
    );

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch swap rate" }), { status: 500 });
    }

    const { data } = await res.json();
    const rate = data?.[0]?.quote?.[to]?.price;

    if (!rate) {
      return new Response(JSON.stringify({ error: "Invalid response from swap rate API" }), { status: 500 });
    }

    return new Response(JSON.stringify({ rate }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
