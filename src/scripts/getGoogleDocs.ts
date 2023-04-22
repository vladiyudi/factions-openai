import { google, docs_v1 } from "googleapis";
import { factionsInfo } from "@/utils/FactionsInfo";
import {encode} from 'gpt-3-encoder'

function organizeFactionInfo(data: any) {
  factionsInfo.forEach((faction) => {
    let saveLeader = false;
    let saveStory = false;
    data.forEach((content:any) => {
      if (content.startsWith(faction.leader) && !saveLeader) {
        saveLeader = true;
        saveStory = false;
      } else if (content.startsWith(faction.name) && !saveStory) {
        saveLeader = false;
        saveStory = true;
      }

      if (saveLeader) {
        faction.backstory += content;
       
      } else if (saveStory) {
        faction.story += content;
        
      }
    });
  });

  // console.log(factionsInfo);

  // createFactionsObject(factionsInfo);
}

function createFactionsObject(info:any) {

    const factions = info.map((faction:any) => {
        return {
            name: faction.name,
            leader: faction.leader,
            story: faction.story + faction.backstory,
            tokens: encode(faction.story).length + encode(faction.backstory).length,
            chunks: []
        }
    })
    // console.log(factions)
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFilename: "./src/scripts/bot.json",
    scopes: "https://www.googleapis.com/auth/documents.readonly",
  });

  const client = google.docs({ version: "v1", auth }) as docs_v1.Docs;

  const documentId = "12MtYGn_GK0LW3VxFlVX-uzK1RwUpldBAI_MgugG1h68";
  const res = await client.documents.get({ documentId });

  // const content = res.data.body.content;
  // const data: any []= [];
  // content?.forEach((element) => {
  //   if (element.paragraph) {
  //     const body = element.paragraph.elements[0].textRun;

  //     if (body?.content && body.content !== "\n") {
  //       data.push(body.content);
  //     }
  //   }
  // });

  // console.log(data);

  // organizeFactionInfo(data);

  //   console.log(res.data.body.content[3].paragraph.elements[0].textRun.content);
}

main().catch(console.error);
