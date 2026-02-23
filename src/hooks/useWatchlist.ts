import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface WatchlistItem {
  id: string;
  media_id: number;
  media_type: string;
  title: string;
  poster_path: string | null;
  added_at: string;
}

export const useWatchlist = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: watchlist = [] } = useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });
      return (data || []) as WatchlistItem[];
    },
    enabled: !!user,
  });

  const isInWatchlist = (mediaId: number, mediaType: string) =>
    watchlist.some((w) => w.media_id === mediaId && w.media_type === mediaType);

  const toggleMutation = useMutation({
    mutationFn: async ({ mediaId, mediaType, title, posterPath }: { mediaId: number; mediaType: string; title: string; posterPath: string | null }) => {
      if (!user) throw new Error("Not authenticated");
      const exists = isInWatchlist(mediaId, mediaType);
      if (exists) {
        await supabase.from("watchlist").delete().eq("user_id", user.id).eq("media_id", mediaId).eq("media_type", mediaType);
      } else {
        await supabase.from("watchlist").insert({ user_id: user.id, media_id: mediaId, media_type: mediaType, title, poster_path: posterPath });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist", user?.id] }),
  });

  return { watchlist, isInWatchlist, toggle: toggleMutation.mutate, isToggling: toggleMutation.isPending };
};
