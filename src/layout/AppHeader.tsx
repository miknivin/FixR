"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import { usePathname, useRouter } from "next/navigation";
import { useLogoutMutation } from "@/app/lib/redux/api/authApi";
import { ChevronDownIcon } from "@/icons";

// Create a context for sidebar toggle
const SidebarContext = React.createContext<{
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}>({
  isMobileOpen: false,
  toggleMobileSidebar: () => {},
});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const toggleMobileSidebar = () => setMobileOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isMobileOpen, toggleMobileSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

type NavItem = {
  name: string;
  path?: string;
  subItems?: { name: string; path: string; new?: boolean }[];
  adminOnly?: boolean;
};

const AppHeader: React.FC = () => {
  // const [ setApplicationMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<{ type: string; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout, ] = useLogoutMutation();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleMobileSidebar } = useContext(SidebarContext);

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      path: "/",
    },
      {
      name: "Projects",
      path: "/projects",
    },
    {
      name: "Bug Reports",
      subItems: [
        { name: "List Bugs", path: "/bugs", new: false },
        { name: "New Bug", path: "/bugs/new", new: false },
      ],
    },
    {
      name: "Admin",
      subItems: [
        { name: "Manage Users", path: "/admin/users", new: false },
      ],
      adminOnly: true,
    },

  ].filter((item) => !item.adminOnly || (item.adminOnly && user?.role === "ADMIN"));

  const isActive = (path: string) => path === pathname;

  const handleSignOut = async () => {
    try {
      await logout().unwrap();
      router.push("/signin");
      // setApplicationMenuOpen(false);
      toggleMobileSidebar();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "header", index });
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `header-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = () => (
    
    <ul className="flex flex-row gap-4 flex-wrap">
      {navItems.map((nav, index) => (
        <li key={nav.name} className="relative">
          {nav.subItems ? (
            <button
              onClick={() => {
                setOpenSubmenu((prev) =>
                  prev?.type === "header" && prev.index === index
                    ? null
                    : { type: "header", index }
                );
              }}
              className={`menu-item ${
                openSubmenu?.type === "header" && openSubmenu.index === index
                  ? "menu-item-active text-brand-500"
                  : "menu-item-inactive text-gray-700 dark:text-gray-300"
              } py-2 px-3`}
            >
              {nav.name}
              <span
                className={`ml-2 inline-block transition-transform duration-200 ${
                  openSubmenu?.type === "header" && openSubmenu.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                }`}
              >
                <ChevronDownIcon/>
              </span>
            </button>
          ) : (
            <Link
              href={nav.path!}
              onClick={(e) => {
                if (nav.name === "Sign Out") {
                  e.preventDefault();
                  handleSignOut();
                }
              }}
              className={`menu-item ${
                isActive(nav.path!) ? "menu-item-active text-brand-500" : "menu-item-inactive text-gray-700 dark:text-gray-300"
              } py-2 px-3`}
            >
              {nav.name}
            </Link>
          )}
          {nav.subItems && (
            <div
              ref={(el) => {
                subMenuRefs.current[`header-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300 absolute left-0 top-full bg-white dark:bg-gray-900 shadow-md rounded-md z-50"
              style={{
                minWidth: "150px",
                height:
                  openSubmenu?.type === "header" && openSubmenu.index === index
                    ? `${subMenuHeight[`header-${index}`] || 0}px`
                    : "0px",
              }}
            >
              <ul className="py-2">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item block px-4 py-2 text-sm ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active text-brand-500"
                          : "menu-dropdown-item-inactive text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {subItem.name}
                      {subItem.new && (
                        <span
                          className={`ml-2 inline-block text-xs px-1.5 py-0.5 rounded ${
                            isActive(subItem.path)
                              ? "menu-dropdown-badge-active bg-brand-100 text-brand-500"
                              : "menu-dropdown-badge-inactive bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                          }`}
                        >
                          new
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-[999] dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-start justify-between grow lg:flex-row lg:items-center lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:border-b-0 lg:px-0 lg:py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                width={52}
                height={52}
                // className="dark:hidden"
                src="/images/logo/logo-icon.png"
                alt="Logo"
              />
              {/* <Image
                width={32}
                height={32}
                className="hidden dark:block"
                src="images/logo/logo-icon-dark.png"
                alt="Logo"
              /> */}
            </Link>
            <div className="hidden lg:block">{renderMenuItems()}</div>
          </div>

          <button
            onClick={toggleMobileSidebar}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Toggle Sidebar Menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18C21 17.4477 20.5523 17 20 17H4Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className="hidden lg:block lg:me-4">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />
                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span> ⌘ </span>
                  <span> K </span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          className="flex items-center gap-2 2xsm:gap-3 px-5 py-4 lg:px-0 lg:py-0"
        >
          <ThemeToggleButton />
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;