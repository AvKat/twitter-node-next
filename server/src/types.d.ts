import { Connection, IDatabaseDriver } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";

export type EmContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
};
