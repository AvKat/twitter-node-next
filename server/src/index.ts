import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConf from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(mikroConf)
    await orm.getMigrator().up();

    const em = orm.em.fork();


    const posts = await em.find(Post, {});
    console.log(posts);
}


main()