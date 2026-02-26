# mongoexport 

Just provide db url and will export whole database inside local storage inside `take_a_dump_here` dir.

Clone and Run:
```bash
bun install; 
```

Startup with: 
```bash
bun start <db-url> <optional:out-dir>
```

Build and executable: 
```bash
bun run build;
./target/mongoexport <db-url> <optional:out-dir>
```
