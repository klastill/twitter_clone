import { collection, query, onSnapshot, orderBy } from "@firebase/firestore";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import { dbService } from "fbase";
import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";


const Home = ({userObj}) => {
  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    const q = query(collection(dbService, "tweets"),
    orderBy('createdAt', "desc")
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const newArray = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
    setTweets(newArray);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="container">
      <TweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  );
}
export default Home;