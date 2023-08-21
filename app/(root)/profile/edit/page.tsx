import { fetchUser } from "@/actions/user.action";
import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const EditPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };
  return (
    <>
      <h1 className="head-text">Edit Profile</h1>

      <section className="mt-12">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </>
  );
};

export default EditPage;
