import { Kanban, KanbanColumn } from "@/components/closed/kanban";
import { KanbanCard } from "@/components/closed/kanban-card";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PlusIcon, MoreVerticalIcon } from "lucide-react";
import React from "react";

export function LandingPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      header={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <Kanban
        columns={mockLists}
        data={mockTasks}
        groupKey="listId"
        render={(group) => (
          <KanbanColumn
            id={group.id}
            key={group.id}
            items={group.items}
            header={<h5 className="text-sm font-medium">{group.title}</h5>}
            actions={
              <React.Fragment>
                <Button className="size-6" variant="ghost">
                  <PlusIcon />
                </Button>
                <Button className="size-6" variant="ghost">
                  <MoreVerticalIcon />
                </Button>
              </React.Fragment>
            }
            render={(item) => <KanbanCard key={item.id} title={item.title} />}
          />
        )}
      />
    </DashboardLayout>
  );
}

export type List = {
  id: string;
  title: string;
};

export type Task = {
  id: string;
  title: string;
  priority: string;
  listId: string;
  assignee: string;
  dueDate: Date;
};

export const mockLists: List[] = [
  { id: "list-1", title: "Backlog" },
  { id: "list-2", title: "In Progress" },
  { id: "list-3", title: "Tests" },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Design login page",
    priority: "High",
    listId: "list-1",
    assignee: "Alice",
    dueDate: new Date(),
  },
  {
    id: "task-2",
    title:
      "Trello Tip: Cards can summarize specific projects and efforts that your team is working on to reach the goal.",
    priority: "Medium",
    listId: "list-1",
    assignee: "Bob",
    dueDate: new Date(),
  },
  {
    id: "task-3",
    title: "Implement auth flow",
    priority: "High",
    listId: "list-2",
    assignee: "Charlie",
    dueDate: new Date(),
  },
  {
    id: "task-4",
    title: "Write unit tests",
    priority: "Low",
    listId: "list-2",
    assignee: "Diana",
    dueDate: new Date(),
  },
  {
    id: "task-5",
    title: "Deploy to production",
    priority: "High",
    listId: "list-3",
    assignee: "Eve",
    dueDate: new Date(),
  },
];
