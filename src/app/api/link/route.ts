import axios from "axios";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const href = url.searchParams.get("url");
  if (!href) return new Response("Invalid Href", { status: 400 });

  const res = await axios.get(href);
  const titleMatch = res.data.match(/<title[^>]*>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "No Title";

  const descriptionMatch = res.data.match(
    /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/
  );
  const description = descriptionMatch ? descriptionMatch[1] : "No Description";

  const imageMatch = res.data.match(
    /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/
  );
  const imageUrl = imageMatch ? imageMatch[1] : "No Image";

  return new Response(
    JSON.stringify({
      success: 1,
      meta: { title, description, image: { url: imageUrl } },
    }),
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );
}
