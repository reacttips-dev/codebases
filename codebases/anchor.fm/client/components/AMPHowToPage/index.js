import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { Link } from 'react-router-dom';
import AMPPage from '../AMPPage';
import AMPPageHeader from '../AMPPageHeader';
import AMPPageSection from '../AMPPageSection';
import AMPPodcastReadySection from '../AMPPodcastReadySection';
import Img from '../Img';
import { AppStoreButton, PlayStoreButton } from '../AppDownloadButtons';
import styles from './styles.sass';
import { METADATA } from './constants';

const IMG_PREFIX = 'https://d12xoj7p9moygp.cloudfront.net/images/';

const PodcastLink = () => (
  <div className={styles.readyContainer}>
    <p>Ready to start your podcast?</p>
    <div className={styles.getStarted}>
      <Link to="/onboarding/existingpodcast">
        <button>GET STARTED</button>
      </Link>
    </div>
    <div className={styles.mobileButtons}>
      <AppStoreButton width={195} height={57} />
      <PlayStoreButton width={195} height={57} />
    </div>
  </div>
);

const AmpHowToPage = () => (
  <AMPPage>
    <div>
      <AMPPageHeader
        title="How To Start A Podcast"
        subtitle="Anchor is the easiest way to start a podcast."
      />
      <AMPPageSection color="gray" className={styles.podcastSubHeader}>
        <h3>
          Podcasting doesn’t have to be as complicated as you think. With
          Anchor, making a podcast is really easy.
        </h3>
        <p>Let us show you how it's done.</p>
        <Row>
          <Col xs={12} sm={5}>
            <ol className={styles.navList}>
              <li>
                <a href="#why">Why start a podcast?</a>
              </li>
              <li>
                <a href="#gettingstarted">Getting started</a>
              </li>
              <li>
                <a href="#recording">Recording your first episode</a>
              </li>
              <li>
                <a href="#recording">Talking to other people on your podcast</a>
              </li>
              <li>
                <a href="#distributing">Distributing your podcast</a>
              </li>
              <li>
                <a href="#audience">
                  Sharing your podcast and growing your audience
                </a>
              </li>
              <li>
                <a href="#listening">
                  What's next? How to keep people listening
                </a>
              </li>
            </ol>
          </Col>
          <Col
            className={`col-sm-7 col-xs-12 ${styles.firstImage} ${styles.verticalCenterImage}`}
          >
            <Img
              alt="Old way to start a podcast"
              src={`${IMG_PREFIX}how-to-start-a-podcast-old-way-2.png`}
              width={228}
              height={160}
              layout="fixed"
              withRetina
            />
            <Img
              alt="New way to start a podcast"
              src={`${IMG_PREFIX}how-to-start-a-podcast-new-way-2.png`}
              width={228}
              height={160}
              layout="fixed"
              withRetina
            />
          </Col>
        </Row>
        <p className={styles.skillsharePrompt}>
          We partnered with Skillshare to bring you a free online class to help
          you create your own podcast. In just over an hour, our very own John
          Lagomarsino walks you through the entire process of creating a
          podcast, from initial concepting and recording to distribution and
          launch. You can watch it free today:{' '}
          <a
            href="https://skl.sh/anchor"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://skl.sh/anchor
          </a>
        </p>
      </AMPPageSection>
      <AMPPageSection id="why">
        <h2>1. Why start a podcast?</h2>
        <Row>
          <Col xs={12} sm={8}>
            <ul>
              <li>
                You have a story to tell, and audio is an intimate, relatable
                way to tell it.
              </li>
              <li>
                Listeners feel connected to the podcasts they listen to, and to
                the people on them.
              </li>
              <li>
                It’s really fun - and so rewarding to hear that people love
                listening to your podcast.
              </li>
              <li>
                Nearly 70 million Americans listen to podcasts every month, and
                that number is going up.
              </li>
            </ul>
            <p>
              You’ve probably noticed that making podcasts is becoming more
              popular, too. It used to be that you needed an expensive
              microphone, deep technical knowledge, and lots of time. Now that
              everyone’s got a great microphone in their pocket, it’s possible
              for anyone to create compelling audio from anywhere.
            </p>
          </Col>
          <Col
            className={`col-sm-4 col-xs-12 ${styles.imageCol} ${styles.verticalCenterImage}`}
          >
            <Img
              alt="Why start a podcast"
              src={`${IMG_PREFIX}how-to-start-a-podcast-why.png`}
              width={249}
              height={318}
              layout="responsive"
              withRetina
            />
          </Col>
        </Row>
      </AMPPageSection>
      <AMPPageSection color="gray" id="gettingstarted">
        <Row>
          <Col xs={12}>
            <h2>2. Getting started</h2>
            <p>
              There’s one question to ask when you start a podcast: what’s your
              show about? You don’t necessarily need to be an expert on the
              subject you choose. But it should be something you’re genuinely
              interested in, and something you like talking about.
            </p>
            <p>
              The first episode of our own podcast, “I Should Start a Podcast”,
              is all about finding a topic for your show:
            </p>
            <div className={styles.featuredEmbed}>
              <div className={styles.featuredEmbedFrame}>
                <iframe
                  title="How to Make a Podcast: What's Your Podcast About"
                  src="https://anchor.fm/startapodcast/embed/episodes/Whats-your-podcast-about-e17krq/a-a2q3ft"
                  height="100%"
                  width="100%"
                  frameBorder="0"
                  scrolling="no"
                />
              </div>
            </div>
            <p>
              Think about how you’ll format your show. Will it be co-hosted?
              Will you interview guests? Maybe you’ll gather sound from around
              your neighborhood, or take questions from listeners. Finding the
              right format for your show is finding the best way to tell your
              story. Keep in mind that you’re not committing to the same format
              forever, but settling on one to start with can take away a lot of
              the guesswork and let you focus on getting your podcast going.
              &nbsp;
              <Link to="/startapodcast/episodes/Show-Structure-e19rmg">
                You can find some more format tips here
              </Link>
              .
            </p>
          </Col>
        </Row>
        <PodcastLink />
      </AMPPageSection>
      <AMPPageSection id="recording">
        <h2>3. Recording your first episode</h2>
        <Row>
          <Col className={`col-sm-5 col-xs-12 ${styles.imageCol}`}>
            <Img
              alt="Podcast first episode"
              src={`${IMG_PREFIX}how-to-start-a-podcast-first.png`}
              width={349}
              height={250}
              layout="responsive"
              withRetina
            />
          </Col>
          <Col xs={12} sm={7} className={styles.wrapAround}>
            <p>
              Your podcast is automatically available for people to hear on
              Anchor as soon as you add some audio. But you’ll probably want to
              also make it available on other podcast platforms, like Apple
              Podcasts (aka iTunes), Google Play Music, Overcast, Pocket Casts,
              Spotify, and more.
            </p>
            <p>
              With Anchor, all you need to do is select the button that says
              “Distribute my podcast everywhere.” We’ll automatically submit
              your podcast to Apple Podcasts, Google Play Music, Overcast, and
              Pocket Casts. That’s it! We’ll notify you as it becomes available
              in each of these places; this process usually takes between 24-48
              hours.
            </p>
          </Col>
        </Row>
        <p>
          The best way to get your footing is to just start recording, listen to
          what you’ve made, and iterate from there. Anchor removes all the
          technical complications, so the only hurdle will be just figuring out
          what you want to say!
        </p>
        <ul className={styles.anchorSteps}>
          <li>
            Download the free Anchor mobile app for iOS or Android and create an
            account.
          </li>
          <li>Tap any tool to add some audio to your episode.</li>
          <li>Add a caption and publish the segment to your podcast.</li>
          <li>
            Keep adding segments to finish your episode. When you’re done, just
            give it a name and share it with the world!
          </li>
        </ul>
        <p>
          If you already have audio that you’d like to turn into your first
          episode, you can do that too – just log in and upload your file(s) at{' '}
          <Link to="/">anchor.fm</Link>.
        </p>
        <Link to="/feature">Read more about Anchor's features &gt;</Link>
        <PodcastLink />
      </AMPPageSection>
      <AMPPageSection id="talking">
        <h2>4. Talking to other people on your podcast</h2>
        <p>
          Conversations can make your podcast come alive, and give your listener
          the chance to sit in on an amazing discussion. Anchor makes it easy
          for those conversations to happen, whether you know your cohost, or
          you want to meet someone new.
        </p>
        <p>
          You can use our Record with Friends feature to connect up to 10 people
          who can record together, from anywhere in the world, on their phones.
          (Yup, it’s free.)
        </p>
        <p>
          And if you want to find someone new to talk to, just tap a topic in
          Anchor Cohosts, and we’ll pair you up with someone else who’s ready to
          talk about the same thing. When the recording’s done, each of you can
          add the conversation to your own podcasts.
        </p>
        <p>
          Need some tips for having a great conversation on your podcast?
          There’s an episode for that!
        </p>
        <div className={styles.featuredEmbed}>
          <div className={styles.featuredEmbedFrame}>
            <iframe
              title="How to Make a Podcast: Conversations"
              src="https://anchor.fm/startapodcast/embed/episodes/Conversations-e1b76d/a-a331j6"
              height="100%"
              width="100%"
              frameBorder="0"
              scrolling="no"
            />
          </div>
        </div>
        <PodcastLink />
      </AMPPageSection>
      <AMPPageSection id="distributing">
        <h2>5. Distributing your podcast</h2>
        <p />
        <Row>
          <Col className={`col-sm-4 col-xs-12 ${styles.imageCol}`}>
            <Img
              alt="Distribute your podcast with Anchor"
              src={`${IMG_PREFIX}how-to-start-a-podcast-anchor.png`}
              width={220}
              height={220}
              layout="responsive"
              withRetina
            />
          </Col>
          <Col xs={12} sm={8}>
            <p>
              With Anchor, if you choose to distribute your podcast everywhere,
              we’ll automatically submit your podcast to other podcast
              platforms, like Apple Podcasts, Overcast, Pocket Casts, Spotify,
              and more. That’s it! We’ll notify you as it becomes available on
              each platform; this process usually takes between 24-48 hours.
            </p>
            <p>
              We’re adding support for more podcast platforms all the time. For
              now, if you’d like to make your podcast available on additional
              platforms that we don’t automatically distribute to, you can
              easily submit your podcast anywhere you want using the RSS feed
              you can find in your settings.
            </p>
          </Col>
        </Row>
        <p>
          You’ll only need to distribute your podcast once. After it’s set up,
          you’ll be able to sync your future episodes to all platforms with just
          one tap.
        </p>
        <Link to="/">
          Read more about distributing your podcast on Anchor &gt;
        </Link>
        <PodcastLink />
      </AMPPageSection>
      <AMPPageSection color="gray" id="audience">
        <h2>6. Sharing your podcast and growing your audience</h2>
        <Row>
          <Col xs={12} sm={6}>
            <p>
              As soon as you’ve set up your new podcast, you’ll want to start
              telling people about it. Start with friends and family, get
              feedback, and then tell the world about your show!
            </p>
            <h3>Share your Anchor profile </h3>
            <p>
              Anyone with an Anchor podcast gets a custom Anchor URL (e.g.,
              anchor.fm/startapodcast). When you share this link with people,
              they’ll be taken right to your podcast – either in the Anchor
              mobile app if they have it installed, or your Anchor web profile
              if they don’t.
            </p>
          </Col>
          <Col className={`col-sm-6 col-xs-12 ${styles.imageColSharing}`}>
            <Img
              alt="Share your podcast to an audience"
              src={`${IMG_PREFIX}how-to-start-a-podcast-audience.png`}
              width={349}
              height={250}
              layout="responsive"
              withRetina
            />
          </Col>
        </Row>
        <p>
          Your Anchor profile includes links to all the platforms where your
          podcast is available, so you don’t have to worry about which link to
          share with people. They can listen on Anchor, or in whatever podcast
          app they prefer!
        </p>
        <h3>Embed your podcast on your blog or website</h3>
        <p>
          If you already have your own blog or website, you can easily embed
          your podcast there so people can listen without having to leave your
          site. Grab the embed code from your Anchor web profile or from your
          dashboard on the web.
        </p>
        <Row>
          <Col className={`col-sm-6 col-xs-12 ${styles.imageColSharing}`}>
            <Img
              alt="Podcast Transcription Text"
              src={`${IMG_PREFIX}how-to-start-a-podcast-transcription-3.png`}
              withRetina
              width={368}
              height={206}
              layout="responsive"
              withRetina
            />
          </Col>
          <Col xs={12} sm={6}>
            <h3>Make a transcribed video</h3>
            <p>
              A great way to promote your most recent episode (or even an
              upcoming one) is by sharing a transcribed video to Twitter,
              Facebook, Instagram, YouTube, etc. This way, even if people don’t
              have their sound on, they can still get a sense for what’s in your
              episode and convert to listeners.
            </p>
          </Col>
        </Row>
        <p>
          Anchor automatically transcribes all short audio (anything under 3
          minutes), so if you want to make a video, all you need to do is choose
          your colors, review the transcription, and share. You can export a
          video in square, portrait, or landscape formats, so it’ll look great
          on any platform!
        </p>
        <PodcastLink />
      </AMPPageSection>
      <AMPPageSection id="listening">
        <h2>7. What's next? How to keep people listening</h2>
        <Row>
          <Col xs={12} sm={7}>
            <p>
              The best way to keep your audience engaged is to make new episodes
              consistently, and to interact with the people listening. Here’s
              how Anchor can help.
            </p>
            <h3>Keep it casual</h3>
            <p>
              Not every episode has to be long or meticulously polished. Try
              making casual daily content to keep your audience interested in
              between longer episodes. (You can even keep that extra audio
              exclusive to Anchor if you want.)
            </p>
          </Col>
          <Col className={`col-sm-5 col-xs-12 ${styles.imageColSharing}`}>
            <Img
              alt="Podcast Sharing"
              src={`${IMG_PREFIX}how-to-start-a-podcast-growth.png`}
              width={302}
              height={199}
              layout="responsive"
              withRetina
            />
          </Col>
        </Row>
        <h3>Let your listeners be a part of the show</h3>
        <p>
          One way to turn your listeners into superfans is to give them ways to
          be involved with your podcast:
        </p>
        <p>
          📞 Take <strong>voice messages</strong> from listeners. Easily preview
          your messages and add your favorites to your next podcast episode.
          It’s a great way to easily get more audio for your podcast, and get
          your listeners directly involved with your show!
        </p>
        <p>
          👋 Choose a lucky listener to record a segment with you. You can
          invite anyone who follows you on Anchor to join your recordings.
        </p>
        <h3>That’s it!</h3>
        <p>
          We can’t wait for you to get started with your own podcast. Good luck
          and have fun!
        </p>
        <strong>
          Still have questions? Visit our{' '}
          <a href="https://help.anchor.fm">help page.</a>
        </strong>
        <PodcastLink />
      </AMPPageSection>
      <AMPPodcastReadySection />
    </div>
  </AMPPage>
);

export { AmpHowToPage as default, PodcastLink, METADATA };
