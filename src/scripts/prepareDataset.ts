import { encode } from "gpt-3-encoder";
import { factions } from "../utils/dataset";
import fs from "fs";

const CHUNK_SIZE = 200;

 function createFactionsObject(info: any) {
  const factions = info.map((faction: any) => {
    return {
      name: faction.name,
      leader: faction.leader,
      story: faction.story + faction.backstory,
      tokens: encode(faction.story).length + encode(faction.backstory).length,
      chunks: [],
    };
  });

  
  const chankedFactions =  factions.map( (faction: any) => {
   return  getChunks(faction);
  })

  let tokensNumber = 0;
  chankedFactions.forEach((faction: any) => {
    tokensNumber += faction.tokens;
  })

  const json = {
    tokens: tokensNumber,
    factions: chankedFactions,
  }

  fs.writeFileSync("./src/utils/factionsDataset.json", JSON.stringify(json));
  
}

const getChunks =  (faction: any) => {
  const { name, leader, story, tokens } = faction;
  let factionsChunks = [];
  if (tokens > CHUNK_SIZE) {
    const split = story.split(".");
  
    let chunkText = "";

    for (let i = 0; i < split.length; i++) {
      const sentense = split[i];
      const sentenseTokens = encode(sentense).length;
      const chunkTokens = encode(chunkText).length;

        if (chunkTokens + sentenseTokens > CHUNK_SIZE) {
            factionsChunks.push(chunkText);
            chunkText = "";
        }
        chunkText += sentense + ".";
        // if (sentense[sentense.length -1].match(/[a-z0-9]/i)) {
        //     chunkText += sentense + ".";
        // } else {
        //     chunkText += sentense + " ";
        // }
    }
    factionsChunks.push(chunkText.trim());
  } else {
    factionsChunks.push(story.trim());
  }

const factionsAllChunks = factionsChunks.map((chunk: any, index: number) => {
    return {
      name,
      leader,
      story: chunk,
      tokens: encode(chunk).length,
      embedings: [],
    };
  }
)

  const chankedFaction ={
    ...faction,
    chunks: factionsAllChunks
  }

  return chankedFaction;
};

createFactionsObject(factions);
