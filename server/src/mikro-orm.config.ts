import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

const mikroConf: Parameters<typeof MikroORM.init>[0] = {
    dbName: "twitter-nn",
    type: "postgresql",
    debug: !__prod__,
    migrations: {
        path: path.join(__dirname, "./migrations"),
        glob: '!(*.d).{js,ts}',
    },
    entities: [Post]
}

export default mikroConf;