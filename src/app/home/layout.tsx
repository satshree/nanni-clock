"use client";

import { ReactNode } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";

import { loadAuthStateFromLocalStorage } from "@/utils/storage";

import logo from "@/assets/img/logo.png";
import { endSession } from "@/utils";

function Layout({ children }: { children: ReactNode }) {
  const auth = loadAuthStateFromLocalStorage();

  return (
    <>
      <Box w="100%" h="100px" p="1rem" bgColor="#f2f2f2">
        <Flex align="center" justify="space-between" w="100%" h="100%">
          <Image
            src={logo.src}
            alt="Nanni Clock"
            height={80}
            width={80}
            // style={{ borderRadius: "8px" }}
          />
          <Heading size="lg">Nanny Clock</Heading>
          <Menu>
            <MenuButton
              ml="0.5rem"
              as={Button}
              variant="ghost"
              rightIcon={<FiUser />}
            >
              {auth.user.displayName}
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={endSession}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
      <Box p="1rem">{children}</Box>
    </>
  );
}

export default Layout;
