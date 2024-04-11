"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Text,
} from "@chakra-ui/react";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { TbCode } from "react-icons/tb";

import { endSession } from "@/utils";
import { loadAuthStateFromLocalStorage } from "@/utils/storage";

import "react-datepicker/dist/react-datepicker.css";
import "react-day-picker/dist/style.css";

import logo from "@/assets/img/logo.png";

function Layout({ children }: { children: ReactNode }) {
  const auth = loadAuthStateFromLocalStorage();

  const toast = useToast();
  const router = useRouter();

  if (auth.token === "") {
    toast({
      title: "Session timeout",
      description: "Please log in again",
      status: "info",
      variant: "left-accent",
      isClosable: true,
      position: "bottom-left",
    });
    router.push("/");
  }

  const getDisplayName = () => {
    // console.log("RETURN DATA", authData.user.displayName);
    // return authData.user.displayName;
    return auth.user.displayName;
  };
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

          <Heading size="xs" textAlign="center" p="0 1.5rem">
            Clock in your Nanny's work and generate invoices easily
          </Heading>

          <Menu>
            <MenuButton
              ml="0.5rem"
              as={IconButton}
              variant="ghost"
              icon={<FiUser />}
            ></MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />}>
                <span suppressHydrationWarning>{getDisplayName()}</span>
              </MenuItem>
              <MenuItem
                icon={<FiSettings />}
                onClick={() => router.push("/home/settings")}
              >
                Settings
              </MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={endSession}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
      <Box p="1rem" minH="calc(100% - 100px)">
        {children}
      </Box>
      <br />
      <Box p="1rem" w="100%" backgroundColor="#f9f9f9">
        <Flex align="center" justify="center">
          <Text fontSize="small">Made by Satshree Shrestha</Text>
          <Text fontSize="larger" ml="0.5rem">
            <TbCode />
          </Text>
        </Flex>
      </Box>
    </>
  );
}

export default Layout;
