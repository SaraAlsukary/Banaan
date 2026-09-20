import UserProfileUI from "@/components/UserProfileUI";
import { updateAvatarAction } from "../../actions/user";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function ProfilePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  });

  if (!dbUser) return null;

  return (
    <UserProfileUI
      user={{
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        imageUrl: dbUser.imageUrl,
        createdAt: dbUser.createdAt,
      }}
      ordersList={[]}
      onUpdateAvatar={updateAvatarAction}
    />
  );
}