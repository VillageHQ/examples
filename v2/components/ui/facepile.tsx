interface FacepileProps {
  avatars: string[];
  count?: number;
  maxVisible?: number;
}

export function Facepile({ avatars, count, maxVisible = 3 }: FacepileProps) {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const totalCount = count ?? avatars.length;
  const overflow = totalCount - maxVisible;

  if (visibleAvatars.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center -space-x-2">
      {visibleAvatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt=""
          className="h-5 w-5 rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover"
        />
      ))}
      {overflow > 0 && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 ring-2 ring-white dark:ring-zinc-900">
          <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
            +{overflow}
          </span>
        </div>
      )}
    </div>
  );
}
