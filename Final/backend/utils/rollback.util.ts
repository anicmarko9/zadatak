import { rollbackMigration } from "./db.util";

// rollbackMigration();
(async () => {
  await rollbackMigration();
})();
