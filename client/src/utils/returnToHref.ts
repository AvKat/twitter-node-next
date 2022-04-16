const returnToHref = (pathname: string, return_to: any) => {
  return return_to
    ? {
        pathname,
        query: { return_to },
      }
    : { pathname };
};

export { returnToHref };
