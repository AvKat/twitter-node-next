import React from "react";
import { Navbar } from "./Navbar";
import { Wrapper, WrapperVariants } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariants;
}

const LayoutWithNavbar: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <Navbar />
      <Wrapper variant={variant}> {children}</Wrapper>
    </>
  );
};

export { LayoutWithNavbar };
