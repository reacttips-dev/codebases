import React from 'react';
import { RetinaPicture } from 'client/components/RetinaPicture';
import { Container, Section, TextContainer } from './styles';

export function BrandPartners() {
  return (
    <Section>
      <Container>
        <TextContainer>
          <h2>Partner with top brands</h2>
          <p>
            Spotify Audience Network (SPAN), which powers Anchor Audience Ads,
            is Spotify’s proprietary audio advertising marketplace in which
            advertisers of all sizes will be able to connect with listeners
            consuming a broad range of content. These include Spotify’s
            Originals & Exclusives, podcasts via Megaphone and Anchor, and
            ad-supported music.
          </p>
          <p>
            By using Anchor Audience Ads, you’ll be part of a marketplace with
            some of the top brands in the world, who want to tap into your
            unique audience with relevant ads.
          </p>
        </TextContainer>
        <RetinaPicture
          imagePath="/span/span-headphones-lady"
          alt="Woman listening to a podcast while looking at her phone. the text 'Spoitfy Audience Network' is overlayed on the bottom of the image"
          fallbackExtension="jpg"
        />
      </Container>
    </Section>
  );
}
