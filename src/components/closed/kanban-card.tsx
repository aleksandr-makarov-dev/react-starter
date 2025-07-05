import dayjs from "dayjs";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  AlarmClockIcon,
  CheckSquareIcon,
  FileIcon,
  FlagIcon,
  MessageSquareIcon,
} from "lucide-react";

export type KanbanCardProps = {
  title: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export function KanbanCard({ title }: KanbanCardProps) {
  return (
    <div className="border border-border bg-background rounded p-3 flex flex-col gap-3">
      <div className="flex flex-row flex-wrap gap-1">
        <Badge variant="outline">Frontend</Badge>
        <Badge variant="outline">Urgent</Badge>
        <Badge variant="outline">Next.js</Badge>
        <Badge variant="outline">API Integration</Badge>
        <Badge variant="outline">Authentication</Badge>
        <Badge variant="outline">UX</Badge>
      </div>
      <p className="text-sm">{title}</p>
      <div className="flex flex-row gap-2 items-center flex-wrap text-muted-foreground">
        <Badge variant="destructive">
          <FlagIcon />
          High
        </Badge>
        <Badge className="flex items-center gap-1 bg-accent" variant="outline">
          <AlarmClockIcon />
          {dayjs(new Date(2025, 7, 12)).format("MMMM D, YYYY")}
        </Badge>
        <Badge variant="outline">
          <FileIcon /> 10
        </Badge>
        <Badge variant="outline">
          <MessageSquareIcon /> 5
        </Badge>
        <Badge variant="outline">
          <CheckSquareIcon /> 25
        </Badge>
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
          <Avatar className="size-5">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="size-5">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="size-5">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
