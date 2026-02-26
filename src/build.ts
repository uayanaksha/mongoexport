const CONFIG: Bun.BuildConfig = {
  compile: { outfile: "mongoexport" },
  outdir: 'target/',
  entrypoints: ["./src/main.ts"]
};

Bun.build(CONFIG);
