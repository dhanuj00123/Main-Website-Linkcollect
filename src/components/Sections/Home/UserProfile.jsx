import React, { useEffect, useState } from "react";
import PageLoader from "../../UI/Loader/PageLoader";
import ProfileHeader from "./ProfileHeader";
import CollectionitemV2 from "../../Common/CollectionCard";
import { dataSortByType } from "../../../utils/utils";
import { getByUsername } from "../../../api-services/userService";
import BaseLayout from "../../Layout/BaseLayout/BaseLayout";
import { useDispatch, useSelector } from "react-redux";
import { collectionFetchingFailed, collectionFetchingSuccess, collectionFething } from "../../../store/Slices/collection.slice";
import { downvoteAction, saveAction, unsaveAction, upvoteAction } from "../../../store/actions/collection.action";
const UserProfile = ({ username,windowWidth }) => {
  const dispatch = useDispatch();
  const collection = useSelector((state) => state.collection);
  const [user,setUser] = useState({});

  useEffect(() => {
    // dispatch(getUserCollection({ username}));
    async function getCollectionOfTheUser() {
      dispatch(collectionFething());
      try{
        const res = await getByUsername(username);
        const data = res.data.data;
        const user = {
          name:data.name,
          profilePic:data.profilePic?data.profilePic:"",
          socials:data.socials?data.socials : [],
          totalViews:data.totalViews?data.totalViews:0,
          totalCollections:data.collections.length,
        }
        setUser(user)
        document.title = `${data.name} - ${username}'s LinkCollect Profile`; // Change this to the desired title
        dispatch(collectionFetchingSuccess({data:data}));

      }catch(e){
        console.log(e)
        dispatch(collectionFetchingFailed());
      }
    }
    getCollectionOfTheUser();
  },[dispatch,username]);
  return (
    <BaseLayout>
      {collection.isFetching ? (
        <div className="flex items-center justify-center w-full h-full">
          <PageLoader />
        </div>
      ) : (
        <div className="w-full h-full pb-6 overflow-y-scroll 3xl:px-0 px-8">
          <ProfileHeader
            username={username}
            name={user.name}
            imageUrl={user.profilePic}
            socials={user.socials}
            totalViews={user.totalViews}
            totalCollections={user.totalCollections}
          />
           <div className=" w-full">
          {collection.collections.length > 0 ? (
            <div className="flex items-start justify-start w-full mx-auto 3xl:pl-0 3xl:justify-center">
            <div className="w-full justify-start grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 2xl:gap-6 max-w-[1500px]">
                {collection.collections.map((collections) => (
                  <CollectionitemV2
                    key={collection._id}
                    id={collections._id}
                    image={collections.image}
                    title={collections.title}
                    links={collections.timelines.length}
                    isPublic={collections.isPublic}
                    isPinned={collections.isPinned}
                    description={collections.description}
                    tags={collections.tags}
                    username={username}
                    windowWidth={windowWidth}
                    isOwner={false}
                    upvotes={collections.upvotes}
                    views={collections.views}
                    isSavedOptionVisible={true}
                    onUpvote={upvoteAction}
                    onDownVote={downvoteAction}
                    onSave={saveAction}
                    onUnsave={unsaveAction}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col self-center items-center justify-center w-full h-full">
              <p className="mb-5 text-5xl text-textPrimary">
                No Collection Found
              </p>
              <p className="text-textPrimary">You can add it from extension</p>
            </div>
          )}
        </div>
      </div>
      )}
    </BaseLayout>
  );
};

export default UserProfile;