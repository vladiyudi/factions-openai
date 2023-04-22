import { loadEnvConfig } from "@next/env";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";
import { createClient } from "@supabase/supabase-js";

const json = JSON.parse(
  fs.readFileSync("./src/utils/factionsDataset.json", "utf8")
);

loadEnvConfig("");


const generateEmbeddings = async (factions: any) => {

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPERBASE_URL!,
    process.env.SUPERBASE_SERVICE_ROLE_KEY!
  );
  for (let i = 0; i < factions.length; i++) {
    const faction: any = factions[i];
    for (let j = 0; j < faction.chunks.length; j++) {
      const chunk = faction.chunks[j];
      const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: chunk.story,
      })
      const [{ embedding }] = embeddingResponse.data.data;
      const { data, error } = await supabase
        .from("factions_dataset")
        .insert({
            faction: chunk.name,
            story: chunk.story,
            tokens: chunk.tokens,
            embeding: embedding,
        })
        .select("*");
        if (error) {
          console.log(error);
        } else {
          console.log('saved', chunk.name);
        }

        await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
};

(async () => {
  await generateEmbeddings(json.factions);
})();
