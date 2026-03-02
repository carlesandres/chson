import schema from "@chson/schema";

/**
 * Serves the canonical ChSON JSON Schema.
 *
 * The schema source of truth is in @chson/schema package at:
 * packages/chson-schema/schema/chson.schema.json
 *
 * This route simply imports and serves it with appropriate caching headers.
 */
export async function GET() {
  return Response.json(schema, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "content-type": "application/schema+json",
    },
  });
}
