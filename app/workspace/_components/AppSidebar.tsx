"use client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { UserDetailContext } from "@/context/UserDetailContext"
import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { useContext, useState, useEffect } from "react"
import CreateProjectDialog from "./CreateProjectDialog"
import { ChevronDown, ChevronRight, FileCode } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

type Frame = {
  id: number
  frameId: string | null
  code: string | null
  projectId: string | null
  createdAt: Date | null
}

type Project = {
  id: number
  projectId: string | null
  projectName: string | null
  createdBy: string | null
  createAt: Date | null
  frames: Frame[]
}

export function AppSidebar() {
    const [projectList, setProjectList] = useState<Project[]>([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
    const {userDetail, setUserDetail} = useContext(UserDetailContext);
    const router = useRouter();

    useEffect(() => {
      fetchProjects();
    }, []);

    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        if (response.data.success) {
          setProjectList(response.data.projects);
        }
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        console.error('Error details:', error.response?.data);
        // Set empty list on error to prevent UI issues
        setProjectList([]);
      }
    };

    const toggleProject = (projectId: string) => {
      const newExpanded = new Set(expandedProjects);
      if (newExpanded.has(projectId)) {
        newExpanded.delete(projectId);
      } else {
        newExpanded.add(projectId);
      }
      setExpandedProjects(newExpanded);
    };

    const openFrame = (projectId: string, frameId: string) => {
      router.push(`/playground/${projectId}?frameId=${frameId}`);
    };

    const handleProjectCreated = (projectId: string, frameId: string, projectName: string) => {
      fetchProjects();
      router.push(`/playground/${projectId}?frameId=${frameId}`);
    };

  return (
    <Sidebar>
      <SidebarHeader className="p-5">
      <div className="flex items-center gap-2">
        <Image src={'/logo.svg'} alt="Logo" width={35} height={35} />
        <h2 className="font-bold text-xl">AI Website Builder</h2>
      </div>
      <div className="mt-5 w-full">
        <Button className="w-full" onClick={() => setShowCreateDialog(true)}>
          +Add New Project
        </Button>
      </div>
      
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            {projectList.length === 0 ? (
              <h2 className="text-sm px-2 text-gray-500">No Project Found</h2>
            ) : (
              <div className="space-y-1">
                {projectList.map((project) => (
                  <div key={project.id} className="space-y-1">
                    {/* Project Header */}
                    <div
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary cursor-pointer"
                      onClick={() => toggleProject(project.projectId!)}
                    >
                      {expandedProjects.has(project.projectId!) ? (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="text-sm font-medium truncate">
                        {project.projectName || `Project ${project.projectId?.slice(0, 8)}`}
                      </span>
                    </div>

                    {/* Frames List */}
                    {expandedProjects.has(project.projectId!) && (
                      <div className="ml-6 space-y-0.5">
                        {project.frames.length === 0 ? (
                          <p className="text-xs text-gray-400 px-2 py-1">No frames</p>
                        ) : (
                          project.frames.map((frame, index) => (
                            <div
                              key={frame.id}
                              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-secondary cursor-pointer group"
                              onClick={() => openFrame(project.projectId!, frame.frameId!)}
                            >
                              <FileCode className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">Frame {index + 1}</p>
                                <p className="text-[10px] text-gray-400 font-mono truncate">
                                  {frame.frameId}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="p-3 border rounded-xl space-y-3 bg-secondary">
            <h2 className="flex justify-between items-center">Remaining Credits <span className="font-bold">{userDetail?.credits ?? 0}</span></h2>
            <Progress value={33}/>
            <Button className="w-full">
                Upgrade to Unlimited
            </Button>
        </div>
        <div className="flex items-center gap-2">
            <UserButton />
            <Button variant={'ghost'}>
                Settings
            </Button>
        </div>
      </SidebarFooter>

      {/* Create Project Dialog */}
      <CreateProjectDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onProjectCreated={handleProjectCreated}
      />
    </Sidebar>
  )
}