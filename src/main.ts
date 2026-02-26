import { argv } from "bun";
import { connect } from "mongoose";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";

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
    try {
      const data = await db?.collection(collection.name).find({}).toArray().catch(e => { throw Error(e); });
      await Bun.write(OUT_PATH + `/${collection.name}.json`, JSON.stringify(data, null, 2));
    } catch { console.error("Error while fetching collection:", collection.name) }
  }
  await conn.connection.close();
} catch (err){
  console.error(`[${new Date().toLocaleTimeString()}]`, err?.message ?? err);
  process.exit(0);
}
