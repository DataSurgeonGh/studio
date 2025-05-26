"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppLogo } from '@/components/icons/AppLogo';
import { NoteList } from '@/components/notes/NoteList';
import { useNotes } from '@/hooks/use-notes';
import { FilePlus, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from "@/components/ui/sidebar";


export function AppSidebar() {
  const { addNote, searchTerm, setSearchTerm } = useNotes();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();


  const handleAddNewNote = () => {
    const newNoteId = addNote();
    if (isMobile && newNoteId) {
       // TODO: Consider if sidebar should close on mobile after adding a note
       // setOpenMobile(false); 
    }
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppLogo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">ScriptureScribe</h1>
          </div>
          <SidebarTrigger className="md:hidden group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        <div className="p-4 space-y-4">
          <div className="relative group-data-[collapsible=icon]:hidden">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddNewNote} className="w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:aspect-square" variant="default">
            <FilePlus className="h-5 w-5 group-data-[collapsible=icon]:m-auto" />
            <span className="ml-2 group-data-[collapsible=icon]:hidden">New Note</span>
          </Button>
        </div>
        
        <SidebarMenu className="px-4">
            <NoteList />
        </SidebarMenu>

      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ScriptureScribe
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
