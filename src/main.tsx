// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Add a counter (webview) post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    await reddit.submitPost({
      title: 'My devvit post',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: 'Created post!' });
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Clickers post',
  height: 'tall',
  render: (context) => {
    const [counterState, setCounterState] = useState({ count: 0 });
    console.log('log test 1')
    const handleMessage = (ev: JSONObject) => {
        if (ev.type === 'counterUpdate') {
            setCounterState({ count: ev.data.count });
        }
    };
    return (
        <vstack height="100%" width="100%" gap="medium" alignment="center top">
            <webview
                url="index.html"
                state={counterState}
                onMessage={handleMessage}
                width={"100%"}
                height={"100%"}
                minWidth={"100%"} />
        </vstack>
    );
  },
});

export default Devvit;
