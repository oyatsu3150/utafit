import { RecommendationForm } from "@/components/recommendation-form";
import { songs } from "@/data/songs";

export const metadata = { title: "音域からおすすめ診断" };

export default function RecommendPage() {
  return <main><RecommendationForm songs={songs} /></main>;
}
