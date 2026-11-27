import { PostEditor } from "../PostEditor";

export const metadata = { title: "New post" };

export default function NewPost() {
  return (
    <PostEditor
      post={{ id: "", title: "", slug: "", excerpt: "", content: "", coverImage: "", coverAlt: "", category: "Academy News", tags: "", status: "draft", publishedAt: "", featured: false, metaTitle: "", metaDescription: "", author: "Harriet K, RN" }}
    />
  );
}
