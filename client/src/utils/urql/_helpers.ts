import { Cache } from "@urql/exchange-graphcache";

export const invalidatePosts = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((field) => field.fieldName === "posts");

  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", fi.fieldKey);
  });
};
