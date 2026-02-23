import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useWatchHistory = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: history = [] } = useQuery({
    queryKey: ["watch_history", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("watch_history")
        .select("*")
        .eq("user_id", user.id)
        .order("watched_at", { ascending: false })
        .limit(50);
      return data || [];
    },
    enabled: !!user,
  });

  const addToHistory = useMutation({
    mutationFn: async (item: { mediaId: number; mediaType: string; title: string; posterPath: string | null; seasonNumber?: number; episodeNumber?: number }) => {
      if (!user) return;
      await supabase.from("watch_history").insert({
        user_id: user.id,
        media_id: item.mediaId,
        media_type: item.mediaType,
        title: item.title,
        poster_path: item.posterPath,
        season_number: item.seasonNumber,
        episode_number: item.episodeNumber,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watch_history", user?.id] }),
  });

  return { history, addToHistory: addToHistory.mutate };
};
