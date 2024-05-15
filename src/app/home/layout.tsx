"use client";

import { ReactNode, useState } from "react";
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
  Hide,
  Show,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { FiUser, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import { TbCode, TbHomePlus } from "react-icons/tb";

import { endSession } from "@/utils";
import { loadAuthStateFromLocalStorage } from "@/utils/storage";

import "react-datepicker/dist/react-datepicker.css";
import "react-day-picker/dist/style.css";

import logo from "@/assets/img/logo.png";
import AddHomeModal from "@/components/AddHomeModal";
import { GlobalState } from "@/types";

function Layout({ children }: { children: ReactNode }) {
  const auth = loadAuthStateFromLocalStorage();
  const activeHome = useSelector((state: GlobalState) => state.activeHome);

  const toast = useToast();
  const router = useRouter();

  const [addHome, toggleHomeModal] = useState(false);

  if (auth.token === "") {
    toast({
      title: "Session timeout",
      description: "Please log in again",
      status: "info",
      variant: "left-accent",
      isClosable: true,
      position: "bottom-left",
    });

    if (typeof window !== "undefined") window.location.href = "/";
  }

  const getDisplayName = () => {
    // console.log("RETURN DATA", authData.user.displayName);
    // return authData.user.displayName;
    return auth.user.displayName;
  };

  const getActiveHome = () => activeHome;

  return (
    <>
      <Box w="100%" h="100px" p="1rem" boxShadow="0 0 5px #888888">
        <Flex align="center" justify="space-between" w="100%" h="100%">
          <Image
            src={logo.src}
            alt="Nanni Clock"
            height={80}
            width={80}
            // style={{ borderRadius: "8px" }}
          />

          <Hide below="md">
            <Heading size="xs" textAlign="center" p="0 1.5rem">
              Clock in your Nanny&apos;s work and generate invoices easily
            </Heading>
          </Hide>

          <Menu>
            <MenuButton
              ml="0.5rem"
              as={IconButton}
              variant="ghost"
              icon={<FiMenu />}
            ></MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />}>
                <span suppressHydrationWarning>{getDisplayName()}</span>
              </MenuItem>

              {auth.token !== "" ? (
                <>
                  <MenuItem
                    icon={<TbHomePlus />}
                    onClick={() => toggleHomeModal(true)}
                  >
                    Add Home
                  </MenuItem>
                </>
              ) : null}
              {getActiveHome().id !== "" ? (
                <>
                  <MenuItem
                    icon={<FiSettings />}
                    onClick={() => router.push("/home/settings")}
                  >
                    Settings
                  </MenuItem>
                </>
              ) : null}
              <MenuItem icon={<FiLogOut />} onClick={endSession}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
      <Box p="1rem" minH="calc(100% - 175px)">
        {children}
      </Box>
      <br />
      <Box p="1rem" w="100%" h="90px" backgroundColor="#f9f9f9">
        <Flex align="center" justify="center">
          <Text fontSize="small">Made by Satshree Shrestha</Text>
          <Text fontSize="larger" ml="0.5rem">
            <TbCode />
          </Text>
        </Flex>
        <Show below="md">
          <Heading size="xs" textAlign="center" p="0.5rem 1.5rem 0.25rem">
            Clock in your Nanny&apos;s work and generate invoices easily
          </Heading>
        </Show>
      </Box>

      <AddHomeModal open={addHome} onClose={() => toggleHomeModal(false)} />
    </>
  );
}

export default Layout;
