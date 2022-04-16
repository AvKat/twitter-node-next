import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

// TODO: Redirect to a page with options
const useAuthOnly = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!data?.me && !fetching) {
      const return_to = router.pathname;
      router.replace({ pathname: "/auth/login", query: { return_to } });
    }
  }, [data, fetching, router]);
};

export { useAuthOnly };
