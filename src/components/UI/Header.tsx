"use client";

import { BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react";
import React from "react";
import { Menu, ChevronRight } from "react-feather";

const Header = ({ tag, breadcrumbs }: { tag?: string; breadcrumbs: any[] }) => {
  return (
    <div className="w-full inline-flex justify-between items-center pt-2 bg-white px-3 sticky top-0">
      <div className="flex flex-row items-center">
        <Breadcrumbs
          itemClasses={{
            separator: "rotate-180",
          }}
        >
          {breadcrumbs.map((item) => (
            <BreadcrumbItem key={item.link} href={item.link}>
              {item.title}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
      </div>
      <Button
        isIconOnly
        className="hover:bg-indigo-600/10 bg-white"
        radius="full"
      >
        <Menu className="text-primary" />
      </Button>
    </div>
  );
};

export default Header;
