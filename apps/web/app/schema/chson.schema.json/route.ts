import schema from "@chson/schema";

export async function GET() {
  return Response.json(schema, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
