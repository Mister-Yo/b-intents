import type { FC, PropsWithChildren } from "react";

import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = PropsWithChildren;

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
