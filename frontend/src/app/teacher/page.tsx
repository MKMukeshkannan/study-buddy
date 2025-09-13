'use client'
import { Book, ChevronUp, Home, LogOut, Plus, Settings, User2 } from "lucide-react"
import { SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar"


interface ItemType {
    title: string,
    url: 'home'|'course'|'setting',
    icon: any,
};

const items: ItemType[] = [
  {
    title: "Home",
    url: "home",
    icon: Home,
  },
  {
    title: "My Course",
    url: "course",
    icon: Book,
  },
  {
    title: "Settings",
    url: "setting",
    icon: Settings,
  },
]


import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar,
  SidebarContent,
  SidebarGroup,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { useUserStore } from "@/lib/store"
import {useState} from "react"



export default function Page() {
    const user = useUserStore(x => x.user);

    const [currContent, setCurrContent] = useState<'home'|'course'|'setting'>('home');

    const AppSidebar = () => {
      return (
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>STUDY BUDDY</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu >
                  {items.map((item) => (
                    <SidebarMenuItem  key={item.title}>
                      <SidebarMenuButton asChild >
                        <button onClick={() => {setCurrContent(item.url)}}>
                          <item.icon />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {user?.name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <a href="logout">Log Out</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        </Sidebar>
      )
    }
    return <>
        <AppSidebar />
        <main className="flex w-full">
            <SidebarTrigger className="" />
            <section className="p-5">
                { currContent === 'home' && <HomeContent />}
                { currContent === 'course' && <Course />}
                { currContent === 'setting' && <SettingContent />}
            </section>
        </main>
    </>

};

const Course = () => {
    return <>
        <h1 className="text-7xl font-bold">Courses</h1>
        <a href="teacher/studio" className="w-16 h-16 mt-5 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-300 border cursor-pointer">
            <Plus />
        </a>
    </>
};

const HomeContent = () => {
    return <>
        <h1 className="text-7xl font-bold">Home</h1>
    </>
};

const SettingContent = () => {
    return <>
        <h1 className="text-7xl font-bold">Setting</h1>
    </>
};
