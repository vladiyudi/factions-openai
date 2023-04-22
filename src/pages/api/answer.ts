import { supabaseAdmin, OpenAiStream } from "../../utils/index";


export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { prompt } = (await req.json()) as { prompt: string };
    const stream = await OpenAiStream(prompt);

    return new Response(stream, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error.message", { status: 500 });
  }
};

export default handler;
