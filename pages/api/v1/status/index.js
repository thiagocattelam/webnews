import database from "infra/database.js";
import { version } from "react";

async function status(request, response) {
  const updateAt = new Date().toISOString();
  const versionPostgres = await database.query("SHOW server_version;");
  const databaseVersionValue = versionPostgres.rows[0].server_version;
  const max_connections = await database.query("SHOW max_connections");
  const max_connectionsValue = max_connections.rows[0].max_connections;
  const opened_connections = await database.query(
    "SELECT count(*) FROM pg_stat_activity",
  );
  const opened_connectionsValue = opened_connections.rows[0].count;

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(max_connectionsValue),
        opened_connections: opened_connectionsValue,
      },
    },
  });
}

export default status;
