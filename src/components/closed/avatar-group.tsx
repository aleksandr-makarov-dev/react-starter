import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type AvatarDef = {
  image?: string;
  alt?: string;
  fallback?: string;
};

export type AvatarGroupProps = {
  avatars: AvatarDef[];
  limit?: number;
};

export function AvatarGroup({ avatars, limit = 0 }: AvatarGroupProps) {
  const { visibleAvatars, remaining } = useMemo(() => {
    if (limit === 0) return { visibleAvatars: avatars, remaining: 0 };

    return {
      visibleAvatars: avatars.slice(0, limit),
      remaining: avatars.length - limit,
    };
  }, [avatars, limit]);

  return (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
      {visibleAvatars.map((avatar, index) => (
        <Avatar key={`avatar-${index}`} className="size-5">
          <AvatarImage src={avatar.image} alt={avatar.alt} />
          <AvatarFallback>{avatar.fallback}</AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <Avatar className="size-5">
          <AvatarFallback className="text-xs">+{remaining}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
