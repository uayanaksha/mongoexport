import { connect } from "mongoose";
import { argv } from "bun";
import {mkdir} from "node:fs/promises";
import {existsSync} from "node:fs";

try {
  if(argv.length < 3) {
    throw new Error("bun start <DB_URL> <optional:DUMP_PATH>")
  }
  const DB_URL = argv[2] ?? null;
  const OUT_PATH = argv[3] ?? "dump";
  const conn = await connect(DB_URL).catch(_ => {
    throw Error("DB connection failed: [check url | is the db active ?]");
  });
  const db = conn.connection?.db;
  const collections = await db?.listCollections().toArray() ?? [];
  if(!existsSync(OUT_PATH)){
    const dir_creation = await mkdir(OUT_PATH, {recursive: true});
    if(dir_creation === undefined) {
      throw Error(`OUT_DIR \`${OUT_PATH}\` creation failed`);
    }
  }
  for(const collection of collections){
    const data = await db?.collection(collection.name).find({}).toArray();
    Bun.write(OUT_PATH + `/${collection.name}.json`, JSON.stringify(data, null, 2));
  }
} catch (err){
  console.error(`[${new Date().toLocaleTimeString()}]`, err?.message ?? err);
  process.exit(0);
}
