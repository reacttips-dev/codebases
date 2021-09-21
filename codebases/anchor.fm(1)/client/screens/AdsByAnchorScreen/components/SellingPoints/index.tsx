import React from 'react';
import { Button } from 'client/shared/Button/NewButton';
import { Container, GridContainer, Section, SellingPoint } from './styles';
import { SELLING_POINTS } from './constants';

export function SellingPoints() {
  return (
    <Section>
      <Container>
        <h2>Introducing a better way for podcasters to earn</h2>
        <GridContainer>
          {SELLING_POINTS.map(({ svg, heading, copy }) => {
            return (
              <SellingPoint key={`selling-point-${heading}`}>
                {svg}
                <h3>{heading}</h3>
                <p>{copy}</p>
              </SellingPoint>
            );
          })}
        </GridContainer>
        <Button color="yellow">Get started</Button>
      </Container>
    </Section>
  );
}
